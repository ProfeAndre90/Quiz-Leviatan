export interface ChapterSummary {
  chapter: string;
  title: string;
  pages: string;
  coreConcepts: string[];
  summary: string;
  keyPassages: string[];
}

export const READING_CHAPTERS: ChapterSummary[] = [
  {
    chapter: 'Introducción',
    title: 'El Hombre Artificial y la Creación del Leviatán',
    pages: 'Páginas 2 - 3',
    coreConcepts: ['Hombre artificial', 'Civitas o República', 'Soberanía como alma', 'Salus populi'],
    summary: 'Hobbes compara la creación del Estado con la creación divina del hombre. Así como la naturaleza es imitada por el arte humano para fabricar autómatas y relojes, el arte crea ese gran hombre artificial llamado Estado o República (Leviatán), de mayor fuerza y estatura que el hombre natural, instituido para su protección y defensa.',
    keyPassages: [
      '«Gracias al arte se crea ese gran Leviatán que llamamos república o Estado (en latín civitas) que no es sino un hombre artificial, aunque de mayor estatura y robustez que el natural para cuya protección y defensa fue instituido.»',
      '«La soberanía es un alma artificial que da vida y movimiento al cuerpo entero; los magistrados, nexos artificiales; la recompensa y el castigo, los nervios; la concordia, es la salud; la sedición, la enfermedad; la guerra civil, la muerte.»'
    ]
  },
  {
    chapter: 'Capítulo XIII',
    title: 'De la condición natural del género humano',
    pages: 'Páginas 71 - 74',
    coreConcepts: ['Igualdad natural', 'Desconfianza mutua', 'Competencia, desconfianza, gloria', 'Guerra de todos contra todos', 'Vida solitaria, tosca y breve'],
    summary: 'En el estado de naturaleza, los hombres son iguales en facultades físicas y mentales (el más débil puede matar al más fuerte mediante maquinaciones). De la igualdad brota la desconfianza, y de esta la guerra. Existen tres causas principales de discordia: la competencia (por beneficio), la desconfianza (por seguridad) y la gloria (por reputación). Sin un poder común que atemorice a todos, la condición humana es de perpetuo temor y muerte violenta.',
    keyPassages: [
      '«La Naturaleza ha hecho a los hombres tan iguales en las facultades del cuerpo y del espíritu que... el más débil tiene bastante fuerza para matar al más fuerte, ya sea mediante secretas maquinaciones o confederándose con otro.»',
      '«Así hallamos en la naturaleza del hombre tres causas principales de discordia. Primera, la competencia; segunda, la desconfianza; tercera, la gloria.»',
      '«...existe continuo temor y peligro de muerte violenta; y la vida del hombre es solitaria, pobre, tosca, embrutecida y breve.»',
      '«Donde no hay poder común, la ley no existe; donde no hay ley, no hay justicia. En la guerra, la fuerza y el fraude son las dos virtudes cardinales.»'
    ]
  },
  {
    chapter: 'Capítulo XIV',
    title: 'De la primera y segunda leyes de naturaleza y de los contratos',
    pages: 'Páginas 75 - 83',
    coreConcepts: ['Derecho de naturaleza (ius)', 'Ley de naturaleza (lex)', 'Buscar la paz', 'Transferencia de derechos', 'Contratos y pactos', 'Derechos inalienables'],
    summary: 'Hobbes distingue entre Derecho (libertad) y Ley (obligación). La ley primera y fundamental de naturaleza ordena: «buscar la paz y seguirla», y la segunda ordena: «renunciar al derecho a todas las cosas si los demás consienten». Los contratos son la mutua transferencia de derechos, y cuando hay plazo futuro se denomina pacto. Se aclara que ningún hombre puede renunciar a defender su propia vida ante la muerte inminente.',
    keyPassages: [
      '«El DERECHO consiste en la libertad de hacer o de omitir, mientras que la LEY determina y obliga a una de esas dos cosas... difieren tanto como la obligación y la libertad.»',
      '«Ley primera y fundamental de naturaleza, a saber: buscar la paz y seguirla. La segunda: defendernos a nosotros mismos, por todos los medios posibles.»',
      '«Un hombre no puede renunciar al derecho de resistir a quien le asalta por la fuerza para arrancarle la vida... la promesa de no resistir a la fuerza no transfiere derecho alguno.»'
    ]
  },
  {
    chapter: 'Capítulo XV',
    title: 'De otras leyes de naturaleza (Justicia, Gratitud, Equidad)',
    pages: 'Páginas 84 - 94',
    coreConcepts: ['Tercera ley: cumplir los pactos', 'Definición de injusticia', 'Poder coercitivo del Estado', 'Leyes inmutables y eternas', 'In foro interno vs in foro externo'],
    summary: 'La tercera ley de naturaleza es que los hombres cumplan los pactos que han celebrado: aquí reside la fuente de la justicia. Sin poder coercitivo, los pactos son solo palabras huecas. Las leyes de la naturaleza obligan en conciencia siempre (in foro interno), pero solo obligan en su aplicación práctica (in foro externo) cuando existe seguridad de que los demás también las respetarán.',
    keyPassages: [
      '«Que los hombres cumplan los pactos que han celebrado. Sin ello, los pactos son vanos, y no contienen sino palabras vacías.»',
      '«La definición de INJUSTICIA no es otra sino ésta: el incumplimiento de un pacto. En consecuencia, lo que no es injusto es justo.»',
      '«Las leyes de naturaleza obligan in foro interno, es decir, van ligadas a un deseo de verlas realizadas; en cambio, no siempre obligan in foro externo, es decir, en cuanto a su aplicación.»'
    ]
  },
  {
    chapter: 'Capítulo XVII y XVIII',
    title: 'De las causas, generación del Estado y derechos del soberano',
    pages: 'Páginas 98 - 108',
    coreConcepts: ['El Leviatán como dios mortal', 'Fórmula del pacto', 'Soberano y súbdito', 'Indivisibilidad del poder', 'Inmunidad del soberano ante acusaciones'],
    summary: 'Para superar el estado de anarquía se erige el Estado, transfiriendo todo el poder a un hombre o asamblea. La fórmula es el pacto de cada hombre con cada hombre. El soberano no es parte contratante con los individuos particulares, por lo que no puede cometer quebrantamiento de pacto ni ser acusado con justicia por sus súbditos, quienes son los autores de sus actos. El poder soberano es indivisible e inalienable.',
    keyPassages: [
      '«Esta es la generación de aquel gran LEVIATÁN, o más bien, de aquel dios mortal, al cual debemos, bajo el Dios inmortal, nuestra paz y nuestra defensa.»',
      '«Autorizo y transfiero a este hombre o asamblea de hombres mi derecho de gobernarme a mí mismo, con la condición de que vosotros transferiréis a él vuestro derecho...»',
      '«Como el derecho de representar la persona de todos se otorga a quien todos constituyen en soberano, solamente por pacto de uno a otro, y no del soberano en cada uno de ellos, no puede existir quebrantamiento de pacto por parte del soberano.»'
    ]
  },
  {
    chapter: 'Capítulo XXI',
    title: 'De la libertad de los súbditos',
    pages: 'Páginas 124 - 133',
    coreConcepts: ['Libertad como ausencia de oposición externa', 'Libertad en el silencio de la ley', 'Límites inalienables de la sumisión'],
    summary: 'La libertad civil de los súbditos radica en el silencio de la ley (acciones no reguladas por el soberano, como comprar, vender, educar libremente). No obstante, la sumisión al soberano tiene un límite insuperable: el derecho a defender el propio cuerpo de la muerte, heridas, o privación de elementos vitales. Si el soberano ordena a un condenado matarse a sí mismo, el súbdito tiene libertad de desobedecer.',
    keyPassages: [
      '«Es un HOMBRE LIBRE quien en aquellas cosas de que es capaz por su fuerza y por su ingenio, no está obstaculizado para hacer lo que desea.»',
      '«La libertad de un súbdito radica, por tanto, solamente en aquellas cosas que en la regulación de sus acciones no ha pretermitido el soberano.»',
      '«Si el soberano ordena a un hombre (aunque justamente condenado) que se mate, hiera o mutile a sí mismo... ese hombre tiene libertad para desobedecer.»'
    ]
  }
];
