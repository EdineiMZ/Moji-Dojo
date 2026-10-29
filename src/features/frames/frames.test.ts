import { ALL_TRAVEL_PHRASES } from '@/content/travel';
import { buildStaffRound, FRAMES, fillFrame, staffRomaji, STAFF_FRAMES } from './frames';

describe('fábrica de frases', () => {
  it('cada molde tem palavras e gera frases sem espaços duplos, com romaji e tradução', () => {
    expect(FRAMES.length).toBeGreaterThanOrEqual(10);
    for (const frame of FRAMES) {
      expect(frame.words.length).toBeGreaterThanOrEqual(6);
      for (const word of frame.words) {
        const out = fillFrame(frame, word);
        expect(out.jp).not.toMatch(/ {2}|^ | $/);
        expect(out.jp).toMatch(/^[ぁ-んァ-ヶー ]+$/);
        expect(out.romaji).toMatch(/^[a-zāīūēō' ]+$/i);
        expect(out.pt).not.toMatch(/[{}]/);
      }
    }
  });

  it('palavras repetidas dentro de um molde não existem', () => {
    for (const frame of FRAMES) expect(new Set(frame.words.map((x) => x.jp)).size).toBe(frame.words.length);
  });

  it('reproduz frases de viagem que o app já tem (ignorando espaços), com o mesmo romaji', () => {
    const find = (id: string, jp: string) => fillFrame(FRAMES.find((f) => f.id === id)!, FRAMES.find((f) => f.id === id)!.words.find((x) => x.jp === jp)!);
    const check = (out: { jp: string; romaji: string }) => {
      const found = ALL_TRAVEL_PHRASES.find((p) => p.jp.replace(/ /g, '') === out.jp.replace(/ /g, ''));
      expect(found).toBeDefined();
      expect(out.romaji.replace(/ō/g, 'ō')).toBe(found?.romaji);
    };
    check(find('kudasai', 'メニュー'));
    check(find('doko', 'トイレ'));
    check(find('doko', 'びょういん'));
    check(find('ikura', 'これ'));
    check(find('tabemasen', 'さかな'));
    check(find('arerugi', 'えび'));
  });

  it('as traduções ficam naturais nos moldes com artigo', () => {
    const doko = FRAMES.find((f) => f.id === 'doko')!;
    expect(fillFrame(doko, doko.words[0]!).pt).toBe('Onde fica o banheiro?');
    const kudasai = FRAMES.find((f) => f.id === 'kudasai')!;
    expect(fillFrame(kudasai, kudasai.words[0]!).pt).toBe('Água, por favor');
  });

  it('os moldes novos (horas, datas, pedidos e permissão) montam a frase, o romaji e a tradução esperados', () => {
    const make = (id: string, jp: string) => {
      const frame = FRAMES.find((f) => f.id === id)!;
      return fillFrame(frame, frame.words.find((x) => x.jp === jp)!);
    };
    expect(make('hora-ni', 'さんじ')).toMatchObject({ jp: 'さんじに あいましょう', romaji: 'sanji ni aimashō', pt: 'Vamos nos encontrar às 3 horas' });
    expect(make('checkin', 'さんじ')).toMatchObject({ jp: 'チェックインは さんじから です', romaji: 'chekkuin wa sanji kara desu', pt: 'O check-in é a partir das 3 horas' });
    expect(make('tsuki-ni', 'さんがつ')).toMatchObject({ jp: 'さんがつに にほんへ いきます', romaji: 'sangatsu ni nihon e ikimasu' });
    expect(make('yasumi', 'にちようび')).toMatchObject({ jp: 'にちようびは やすみ ですか', pt: 'Fecha no domingo?' });
    expect(make('te-mo-ii', 'しゃしんを とって')).toMatchObject({ jp: 'しゃしんを とっても いい ですか', romaji: 'shashin o totte mo ii desu ka', pt: 'Posso tirar uma foto?' });
    expect(make('te-kudasai', 'ゆっくり はなして')).toMatchObject({ jp: 'ゆっくり はなして ください', pt: 'Fale devagar, por favor' });
  });
});

describe('moldes novos e a fala do atendente', () => {
  const make = (id: string, jp: string) => {
    const frame = FRAMES.find((f) => f.id === id)!;
    return fillFrame(frame, frame.words.find((x) => x.jp === jp)!);
  };

  it('os cinco moldes novos montam a frase, o romaji e a tradução esperados', () => {
    expect(make('onegai', 'おかいけい')).toMatchObject({ jp: 'おかいけいを おねがいします', romaji: 'okaikei o onegaishimasu', pt: 'A conta, por favor' });
    expect(make('nanji-kara', 'あさごはん')).toMatchObject({ jp: 'あさごはんは なんじから ですか', pt: 'A que horas começa o café da manhã?' });
    expect(make('doko-kaemasu', 'きっぷ')).toMatchObject({ jp: 'きっぷは どこで かえますか', pt: 'Onde posso comprar o bilhete?' });
    expect(make('hanasemasu', 'ポルトガルご')).toMatchObject({ jp: 'ポルトガルごは はなせますか', pt: 'Você fala português?' });
    expect(make('wakarimasen', 'にほんご')).toMatchObject({ jp: 'にほんごは わかりません', pt: 'Eu não entendo japonês' });
  });

  it('toda fala do atendente é kana, tem tradução e romaji legível; nenhum molde repete a mesma fala duas vezes', () => {
    expect(STAFF_FRAMES.length).toBeGreaterThanOrEqual(12);
    for (const f of STAFF_FRAMES) {
      const lines = f.staff ?? [];
      expect(new Set(lines.map((l) => l.jp)).size).toBe(lines.length);
      for (const l of lines) {
        expect(l.jp).toMatch(/^[ぁ-んァ-ヶー ？！。、]+$/);
        expect(l.pt.length).toBeGreaterThan(5);
        expect(staffRomaji(l.jp)).toMatch(/^[a-zāīūēō' ]+$/i);
      }
    }
  });

  it('o romaji da fala tira a pontuação e lê o は como wa', () => {
    expect(staffRomaji('ごちゅうもんは？')).toBe('gochūmon wa');
    expect(staffRomaji('どちら まで いきますか？')).toBe('dochira made ikimasu ka');
    expect(staffRomaji('おなまえを おねがいします。')).toBe('onamae o onegaishimasu');
  });

  it('a rodada tem a fala, o molde certo e dois moldes que não respondem a ela', () => {
    for (let i = 0; i < 80; i++) {
      const round = buildStaffRound();
      expect(round.options).toHaveLength(3);
      expect(new Set(round.options.map((f) => f.id)).size).toBe(3);
      expect(round.options).toContain(round.frame);
      expect(round.frame.staff?.some((l) => l.jp === round.line.jp)).toBe(true);
      // Os errados não aceitam esta fala: só um molde da rodada responde a ela.
      expect(round.options.filter((f) => (f.staff ?? []).some((l) => l.jp === round.line.jp))).toEqual([round.frame]);
    }
  });

  it('não repete o molde da rodada anterior e é repetível com o mesmo sorteador', () => {
    const first = buildStaffRound(() => 0.1);
    expect(buildStaffRound(() => 0.1).frame.id).toBe(first.frame.id);
    for (let i = 0; i < 30; i++) expect(buildStaffRound(Math.random, first.frame.id).frame.id).not.toBe(first.frame.id);
  });
});
