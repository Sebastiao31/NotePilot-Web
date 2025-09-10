export type MockNote = {
  id: string
  title: string
  note: string
  transcript: string
  folder: string
  date: string // ISO 8601 string
}

export const MOCK_NOTES: MockNote[] = [
  {
    id: 'demo-1',
    title: 'Welcome to NotePilot',
    note:
      'This is a sample note. You can edit the `notes/[id]` page to render this content while backend wiring is pending.',
    transcript:
      'Intro meeting transcript: We discussed app structure, mock data needs, and next steps for building the notes page.',
    folder: 'Getting Started',
    date: '2025-09-10T12:00:00.000Z',
  },
  {
    id: 'demo-2',
    title: 'Team Sync – Action Items',
    note:
      'Action items: 1) Implement mock data 2) Build detail view 3) Hook to real data later.',
    transcript:
      'Team sync transcript: Decisions captured around UI, routing, and placeholder content.',
    folder: 'Meetings',
    date: '2025-08-28T16:30:00.000Z',
  },
  {
    id: 'demo-3',
    title: 'Research – Editor Options',
    note:
      'Comparing editor libraries and markdown rendering. This note demonstrates longer body text for layout testing.',
    transcript:
      'Research call transcript: Evaluated rich text vs markdown, performance considerations, and accessibility.',
    folder: 'Research',
    date: '2025-07-15T09:15:00.000Z',
  },
  {
    id: 'demo-4',
    title: 'Research – Editor Options',
    note:
      'Comparing editor libraries and markdown rendering. This note demonstrates longer body text for layout testing.',
    transcript:
      'Research call transcript: Evaluated rich text vs markdown, performance considerations, and accessibility.',
    folder: 'Research',
    date: '2025-07-15T09:15:00.000Z',
  },
  {
    id: 'demo-5',
    title: 'Research – Editor Options',
    note:
      'Comparing editor libraries and markdown rendering. This note demonstrates longer body text for layout testing.',
    transcript:
      'Research call transcript: Evaluated rich text vs markdown, performance considerations, and accessibility.',
    folder: 'Research',
    date: '2025-07-15T09:15:00.000Z',
  },
  {
    id: 'demo-6',
    title: 'Research – Editor Options',
    note:
      'ormação   que   terá   que   dar   conta   dos   processos   que   atravessam   a   ordem   social contemporânea  e  a  existência  de  movimentos  que lhe  são  contrários  ou  alternativos  em articulação com a análise da sociedade portuguesa, capacitando o futuro Assistente Social para  o  trabalho  profissional  reconhecendo  os  limites  e  as  possibilidades  e  a  compreensão do significado social da sua acção. A formação  académica  deve  contribuir  para  a  construção  de  uma  identidade profissional, através de uma sólida qualificação teórica, metodológica e ético-política, e de uma  capacitação  operacional  e  prática  de  investigação  que  alicerce  o  conhecimento  do Serviço  Social  e  a  sua  produção,  dando  suporte  à  interlocução  com  as  outras  áreas  das Ciências Sociais.Estas  concepções  têm  vindo  a  permear  o  projecto  de  formação  em  Serviço  Social no Instituto Superior Miguel Torga (ISMT), que no início do Séc XXI, oferece o curso de licenciatura e o curso de mestrado, criado em 20006. Sob os ventos da Declaração de Bolonha7 é reestruturada a licenciatura em Serviço Social, que apresentava cinco anos de duração e uma formação dirigida para cinco ramos de especialidade8. Em 2003, o plano de estudos em Serviço Social tem a duração de quatro anos, com uma formação generalista em detrimento do plano que vigorava desde 19939. 6 O curso de mestrado em Serviço Social foi criado pela Portaria nº 902/2000 de 28 de Setembro, com a duração de dois anos.7O  processo  de  Bolonha  tem  por  base  um  compromisso,  assumido  em  1999  por  governantes  de  países europeus, que pretende harmonizar, até 2010, os graus e diplomas atribuídos, para facilitar as equivalências de cursos nas universidades dos 45 estados subscritores, a mobilidade e a empregabilidade dos estudantes no espaço comunitário.8 A Portaria nº 15/90 de 9 de Janeiro autoriza o início do funcionamento do curso superior de Serviço Social no Instituto Superior de Serviço Social de Coimbra, sendo reconhecidos os efeitos correspondentes aos  da  titularidade  do  grau  de  licenciatura  do  ensino  público.  Reconhece    ainda  a  Assembleia  Distrital  de Coimbra como entidade instituidora do ISSSC. Em 1993 são introduzidas alterações a este plano de estudos em Serviço Social através da Portaria nº 692/93 de 22 de Julho, nomeadamente, nos dois últimos anos do curso os ramos de especialidade em segurança social,  saúde, justiça e reinserção, aconselhamento, gestão de recursos humanos.9 Cf. Portaria nº 463/ 2003 de 3 de Junho.' ,
    transcript:
      'Research call transcript: Evaluated rich text vs markdown, performance considerations, and accessibility.',
    folder: 'Research',
    date: '2025-07-15T09:15:00.000Z',
  },
]

export function getMockNoteById(id: string): MockNote | undefined {
  return MOCK_NOTES.find((note) => note.id === id)
}

export function getMockNotesByFolder(folder: string): MockNote[] {
  return MOCK_NOTES.filter((note) => note.folder === folder)
}

export function getAllMockNotes(): MockNote[] {
  return [...MOCK_NOTES]
}


