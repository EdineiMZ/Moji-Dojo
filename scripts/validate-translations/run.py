"""Confere traduções japonês -> português com dois modelos abertos, rodando no computador (nada vai para servidor).

1. LaBSE (Apache-2.0): mede se o japonês e o português "dizem a mesma coisa" (similaridade de embeddings) e calcula uma
   nota de margem (Artetxe e Schwenk, 2019): a similaridade do par comparada com a dos vizinhos mais próximos, que é mais
   confiável que um limite fixo.
2. NLLB-200 distilled 600M (CC-BY-NC 4.0, só para conferir, nada dele entra no app): traduz o japonês para o português e
   compara com a tradução do app (similaridade LaBSE entre as duas traduções).

Os dois só APONTAM suspeitas: uma nota baixa não prova erro, e uma nota alta não prova que o japonês está certo.

Uso: python run.py entrada.json saida.json [--nllb-lowest N]
  entrada.json: lista de { "jp": ..., "pt": ..., ... }; as outras chaves passam para a saída.
  --nllb-lowest N: traduz com o NLLB só as N de menor nota LaBSE (padrão: todas).
Precisa de torch, transformers, sentence-transformers e sentencepiece (pip, num venv fora do projeto).
"""
import argparse
import json

import numpy as np
from sentence_transformers import SentenceTransformer

parser = argparse.ArgumentParser()
parser.add_argument('input')
parser.add_argument('output')
parser.add_argument('--nllb-lowest', type=int, default=None)
parser.add_argument('--knn', type=int, default=4)
args = parser.parse_args()

rows = json.load(open(args.input, encoding='utf-8'))
jp = [r['jp'].replace(' ', '').replace('　', '') for r in rows]
pt = [r['pt'] for r in rows]

print('LaBSE...', flush=True)
labse = SentenceTransformer('sentence-transformers/LaBSE', device='cpu')
ej = labse.encode(jp, batch_size=64, normalize_embeddings=True, show_progress_bar=True)
ep = labse.encode(pt, batch_size=64, normalize_embeddings=True, show_progress_bar=True)
sim = (ej * ep).sum(axis=1)

# nota de margem: cos(x, y) dividido pela média da similaridade com os k vizinhos mais próximos de cada lado
k = args.knn


def knn_mean(a, b, chunk=2000):
    out = np.empty(len(a), dtype=np.float32)
    for i in range(0, len(a), chunk):
        s = a[i:i + chunk] @ b.T
        out[i:i + chunk] = np.sort(np.partition(s, -k, axis=1)[:, -k:], axis=1).mean(axis=1)
    return out


if len(rows) > 50:
    nj = knn_mean(ej, ep)
    npt = knn_mean(ep, ej)
    margin = sim / ((nj + npt) / 2)
else:
    margin = np.full(len(rows), np.nan)

for r, s, m in zip(rows, sim, margin):
    r['sim'] = round(float(s), 4)
    r['margin'] = None if np.isnan(m) else round(float(m), 4)

# NLLB: traduz o japonês e compara com a tradução do app
order = np.argsort(sim)
chosen = list(order if args.nllb_lowest is None else order[:args.nllb_lowest])
if chosen:
    import torch
    from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

    print(f'NLLB em {len(chosen)} frases...', flush=True)
    name = 'facebook/nllb-200-distilled-600M'
    tok = AutoTokenizer.from_pretrained(name, src_lang='jpn_Jpan')
    model = AutoModelForSeq2SeqLM.from_pretrained(name).eval()
    bos = tok.convert_tokens_to_ids('por_Latn')
    translated = {}
    batch = 16
    for start in range(0, len(chosen), batch):
        idx = chosen[start:start + batch]
        enc = tok([jp[i] for i in idx], return_tensors='pt', padding=True, truncation=True, max_length=96)
        with torch.no_grad():
            out = model.generate(**enc, forced_bos_token_id=bos, num_beams=2, max_new_tokens=96)
        for i, text in zip(idx, tok.batch_decode(out, skip_special_tokens=True)):
            translated[i] = text
        if (start // batch) % 10 == 0:
            print(f'{start + len(idx)}/{len(chosen)}', flush=True)
    ids = list(translated)
    en = labse.encode([translated[i] for i in ids], batch_size=64, normalize_embeddings=True)
    for pos, i in enumerate(ids):
        rows[i]['nllb'] = translated[i]
        rows[i]['sim_nllb'] = round(float((en[pos] * ep[i]).sum()), 4)

json.dump(rows, open(args.output, 'w', encoding='utf-8'), ensure_ascii=False)
print('pronto', flush=True)
