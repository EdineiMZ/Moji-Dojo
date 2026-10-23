// Este teste roda em Node, mas o projeto só carrega os tipos do Jest: declaramos só o que usamos.
const { parseCsv, firstForm, cleanRows, studyOrder } = require('./n5Clean.cjs') as typeof import('./n5Clean');

const HEADER = 'expression,reading,meaning,tags,guid';
const csv = (...lines: string[]) => [HEADER, ...lines].join('\n');

describe('parseCsv', () => {
  it('lê campos entre aspas com vírgula e aspas duplas dentro', () => {
    expect(parseCsv('a,"b, c","d ""e"""\n1,2,3')).toEqual([['a', 'b, c', 'd "e"'], ['1', '2', '3']]);
  });

  it('aceita CRLF e ignora linhas vazias', () => {
    expect(parseCsv('a,b\r\n\r\nc,d\r\n')).toEqual([['a', 'b'], ['c', 'd']]);
  });
});

describe('firstForm', () => {
  it('fica com a primeira forma e tira "(する)", "(〜を)" e os "～" de sufixos', () => {
    expect(firstForm('足; 脚')).toBe('足');
    expect(firstForm('けっこん (する)')).toBe('けっこん');
    expect(firstForm('(〜を) とお')).toBe('とお');
    expect(firstForm('～くらい; ぐらい')).toBe('くらい');
  });
});

describe('cleanRows', () => {
  it('normaliza palavra e leitura, guarda a linha e a lição do Genki mais baixa', () => {
    const { rows } = cleanRows(
      csv('行く,いく; ゆく,to go,Genki Genki_Ln.5 Genki_Ln.3 JLPT,x', '結婚,けっこん (する),"marriage, wedding",JLPT,y'),
    );
    expect(rows).toEqual([
      { row: 1, jp: '行く', reading: 'いく', en: 'to go', lesson: 3 },
      { row: 2, jp: '結婚', reading: 'けっこん', en: 'marriage, wedding', lesson: null },
    ]);
  });

  it('pula palavra repetida (vale a primeira), campo vazio e leitura que não é só kana', () => {
    const { rows, skipped } = cleanRows(
      csv('九,きゅう,nine,x,1', '九,く,nine,x,2', 'ねこ,,cat,x,3', 'ABC,abc,latin,x,4'),
    );
    expect(rows.map((r) => r.jp)).toEqual(['九']);
    expect(skipped.map((s) => s.row)).toEqual([2, 3, 4]);
  });

  it('recusa um CSV sem as colunas esperadas', () => {
    expect(() => cleanRows('a,b\n1,2')).toThrow();
  });

  it('ordem de estudo: lições do Genki primeiro, depois as demais na ordem do CSV', () => {
    const { rows } = cleanRows(csv('あ,あ,a,Genki_Ln.9,1', 'い,い,i,JLPT,2', 'う,う,u,Genki_Ln.2,3', 'え,え,e,JLPT,4'));
    expect(studyOrder(rows).map((r) => r.jp)).toEqual(['う', 'あ', 'い', 'え']);
  });
});
