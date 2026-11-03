import { Question } from '../types';

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    questionNumber: 1,
    chapter: 'Capítulo XIII: De la condición natural del género humano',
    pagesRef: 'Páginas 71-73',
    dimension: 'Literal',
    title: 'Las tres causas principales de discordia en el estado de naturaleza',
    text: 'En el Capítulo XIII del «Leviatán», Thomas Hobbes sostiene que la naturaleza ha hecho a los hombres prácticamente iguales en sus facultades corporales y espirituales. A partir de esta igualdad y la consiguiente desconfianza mutua, ¿cuáles son las tres causas principales de discordia inherentes al ser humano y qué propósito específico persigue cada una al recurrir a la violencia?',
    quotePrompt: '«Así hallamos en la naturaleza del hombre tres causas principales de discordia...»',
    options: [
      {
        id: 'a',
        text: 'La primera es la competencia (para lograr beneficio o ganancia); la segunda, la desconfianza (para lograr seguridad); y la tercera, la gloria (para ganar reputación y honor).'
      },
      {
        id: 'b',
        text: 'La primera es la avaricia de tierras; la segunda, la venganza por agravios familiares; y la tercera, la devoción religiosa fanática hacia falsos ídolos.'
      },
      {
        id: 'c',
        text: 'La primera es la desigualdad física innata; la segunda, la escasez biológica de alimentos; y la tercera, la falta de educación filosófica en las universidades.'
      },
      {
        id: 'd',
        text: 'La primera es la tiranía de los reyes extranjeros; la segunda, la sedición de las facciones populares; y la tercera, la ignorancia de las leyes civiles escritas.'
      }
    ],
    correctOptionId: 'a',
    points: 1.0,
    explanation: 'Hobbes define explícitamente en el Capítulo XIII que las tres causas primordiales de conflicto en la condición natural humana son: 1) La competencia, que impulsa a atacar por beneficio material y posesiones; 2) La desconfianza, que impulsa a atacar preventivamente para preservar la propia seguridad; y 3) La gloria, que recurre a la fuerza por motivos de reputación, respeto o signos de subestimación.',
    hobbesQuote: '«Así hallamos en la naturaleza del hombre tres causas principales de discordia. Primera, la competencia; segunda, la desconfianza; tercera, la gloria. La primera causa impulsa a los hombres a atacarse para lograr un beneficio; la segunda, para lograr seguridad; la tercera, para ganar reputación.» (Capítulo XIII, pág. 72)'
  },
  {
    id: 2,
    questionNumber: 2,
    chapter: 'Capítulos XIII y XV: De la condición natural y leyes de naturaleza',
    pagesRef: 'Páginas 74 y 84',
    dimension: 'Inferencial',
    title: 'El fundamento ontológico de la justicia y la propiedad («meum et tuum»)',
    text: 'Hobbes argumenta que en la guerra de todos contra todos propia del estado natural, «nada puede ser injusto» y no existe distinción entre lo tuyo y lo mío. De acuerdo con el texto, ¿por qué razón la justicia y la propiedad privada solo pueden existir una vez constituido el Estado civil?',
    quotePrompt: '«Donde no hay poder común, la ley no existe; donde no hay ley, no hay justicia...»',
    options: [
      {
        id: 'a',
        text: 'Porque los hombres salvajes desconocían el concepto del dinero y el trueque mercantil hasta la llegada de las leyes de Roma.'
      },
      {
        id: 'b',
        text: 'Porque la justicia consiste en el cumplimiento de pactos válidos; en el estado natural cada hombre tiene derecho a todo y el temor a que el otro incumpla anula los pactos. Solo un poder soberano coercitivo que inspire suficiente temor al castigo garantiza la obligatoriedad del pacto y protege la propiedad.'
      },
      {
        id: 'c',
        text: 'Porque la justicia es una facultad física del corazón que se atrofia cuando el cuerpo humano se encuentra a la intemperie y se activa únicamente en los tribunales.'
      },
      {
        id: 'd',
        text: 'Porque Dios dictó las leyes civiles exclusivamente a los gobernantes monárquicos y privó a los individuos particulares de toda razón moral antes de la era cristiana.'
      }
    ],
    correctOptionId: 'b',
    points: 1.0,
    explanation: 'Para Hobbes, la justicia no es una propiedad intrínseca de las cosas ni una facultad natural aislada, sino la observancia de pactos. Pero en el estado de naturaleza, cualquier sospecha razonable de que el otro no cumplirá invalida el pacto. Por ello, la justicia y la propiedad solo cobran validez efectiva cuando se instituye un poder coercitivo superior (el Estado) capaz de obligar a todos por igual mediante el temor al castigo.',
    hobbesQuote: '«En esta guerra de todos contra todos, se da una consecuencia: que nada puede ser injusto. Las nociones de derecho e ilegalidad, justicia e injusticia están fuera de lugar. Donde no hay poder común, la ley no existe; donde no hay ley, no hay justicia... Es natural también que en dicha condición no existan propiedad ni dominio, ni distinción entre tuyo y mío... La validez de los pactos no comienza sino con la constitución de un poder civil suficiente para compeler a los hombres a observarlos.» (Capítulo XIII, pág. 74 y Cap. XV, pág. 84)'
  },
  {
    id: 3,
    questionNumber: 3,
    chapter: 'Capítulo XIV: De las leyes naturales y de los contratos',
    pagesRef: 'Páginas 75-76',
    dimension: 'Conceptual',
    title: 'Distinción fundamental entre «Derecho de Naturaleza» y «Ley de Naturaleza»',
    text: 'En el Capítulo XIV, Hobbes aclara una confusión frecuente entre los autores políticos respecto a los términos latinos «ius» y «lex». ¿Cuál es la diferencia precisa que establece entre el Derecho de Naturaleza (ius naturale) y la Ley de Naturaleza (lex naturalis)?',
    quotePrompt: '«Aunque quienes se ocupan de estas cuestiones acostumbran confundir ius y lex, derecho y ley, precisa distinguir esos términos...»',
    options: [
      {
        id: 'a',
        text: 'El Derecho de Naturaleza es la libertad que tiene cada hombre de usar su propio poder según su juicio para conservar su vida; mientras que la Ley de Naturaleza es un precepto o norma general establecida por la razón que le prohíbe hacer aquello que destruya su vida o le prive de los medios de conservarla.'
      },
      {
        id: 'b',
        text: 'El Derecho de Naturaleza obliga siempre a someterse a la Iglesia, mientras que la Ley de Naturaleza autoriza a cada quien a gobernar a los demás a su antojo.'
      },
      {
        id: 'c',
        text: 'El Derecho de Naturaleza corresponde únicamente a los súbditos de las asambleas democráticas, mientras que la Ley de Naturaleza rige para los monarcas hereditarios.'
      },
      {
        id: 'd',
        text: 'Ambos términos expresan exactamente lo mismo (la ley escrita del Estado), y Hobbes señala que distinguirlos es un error pedante de los escolásticos.'
      }
    ],
    correctOptionId: 'a',
    points: 1.0,
    explanation: 'Hobbes subraya que el DERECHO (ius) consiste en la LIBERTAD de hacer o de omitir, mientras que la LEY (lex) determina y OBLIGA a una de esas dos cosas. Difieren tanto como la libertad y la obligación, que son incompatibles cuando se aplican a la misma materia. El derecho natural es la libertad de autopreservación por cualquier medio; la ley natural es el dictado racional que prohíbe la autodestrucción y ordena buscar la paz.',
    hobbesQuote: '«El DERECHO DE NATURALEZA, lo que los escritores llaman comúnmente jus naturale, es la libertad que cada hombre tiene de usar su propio poder como quiera, para la conservación de su propia naturaleza... Ley de naturaleza (lex naturalis) es un precepto o norma general, establecida por la razón, en virtud de la cual se prohíbe a un hombre hacer lo que puede destruir su vida... Así, la ley y el derecho difieren tanto como la obligación y la libertad.» (Capítulo XIV, pág. 75)'
  },
  {
    id: 4,
    questionNumber: 4,
    chapter: 'Capítulos XVII y XVIII: Del Estado y los derechos del soberano',
    pagesRef: 'Páginas 101-104',
    dimension: 'Estructural',
    title: 'La fórmula del pacto fundacional y el carácter no condicional de la soberanía',
    text: 'Al explicar cómo nace el Estado en el Capítulo XVII, Hobbes describe la fórmula del pacto instituyente. Según dicha formulación y lo analizado en el Capítulo XVIII, ¿entre quiénes se celebra efectivamente este pacto y qué implicación tiene esto sobre las posibles acusaciones de los súbditos hacia el Soberano?',
    quotePrompt: '«...instituida por pacto de cada hombre con los demás, en forma tal como si cada uno dijera a todos: autorizo y transfiero a este hombre o asamblea de hombres mi derecho de gobernarme a mí mismo...»',
    options: [
      {
        id: 'a',
        text: 'El pacto se celebra entre el Soberano y el pueblo como persona jurídica previa; si el Soberano se vuelve tirano o viola las promesas electorales, el pueblo puede revocar el contrato y juzgarlo legalmente en un tribunal.'
      },
      {
        id: 'b',
        text: 'El pacto se efectúa recíprocamente entre cada individuo particular con todos los demás, no entre el soberano y cada súbdito. Por ello, el soberano no puede cometer quebrantamiento de pacto, y como cada súbdito es autor de los actos del soberano, ningún súbdito puede acusar con justicia al soberano de injuria.'
      },
      {
        id: 'c',
        text: 'El pacto es celebrado exclusivamente por los nobles y sacerdotes con Dios, quedando el resto de la población como mera servidumbre excluida de la condición de autores.'
      },
      {
        id: 'd',
        text: 'El pacto es temporal por cuatro años; el soberano queda sujeto a las leyes civiles ordinarias y puede ser castigado con penas corporales por el Parlamento si disiente de la mayoría.'
      }
    ],
    correctOptionId: 'b',
    points: 1.0,
    explanation: 'En el modelo hobbesiano, el soberano no pacta con la multitud (pues antes del pacto la multitud no es una persona unificada, sino individuos dispersos). El pacto es de cada súbdito con cada súbdito para transferir el derecho de autogobierno a un tercero (hombre o asamblea). Al no haber pactado el soberano, este no puede cometer quebrantamiento ni ser depuesto legalmente bajo pretexto de infracción; además, siendo cada súbdito "autor" de los actos del soberano ("actor"), acusar al soberano equivaldría a acusarse a sí mismo.',
    hobbesQuote: '«...es una unidad real de todo ello en una y la misma persona, instituida por pacto de cada hombre con los demás, en forma tal como si cada uno dijera a todos: autorizo y transfiero a este hombre o asamblea de hombres mi derecho de gobernarme a mí mismo... Como el derecho de representar la persona de todos se otorga a quien todos constituyen en soberano, solamente por pacto de uno a otro, y no del soberano en cada uno de ellos, no puede existir quebrantamiento de pacto por parte del soberano... cualquiera cosa que el soberano haga no puede constituir injuria para ninguno de sus súbditos.» (Capítulo XVII, pág. 101 y Cap. XVIII, págs. 103-105)'
  },
  {
    id: 5,
    questionNumber: 5,
    chapter: 'Capítulos XIV y XXI: De la libertad de los súbditos y derechos inalienables',
    pagesRef: 'Páginas 77, 82 y 129-130',
    dimension: 'Crítica-Aplicada',
    title: 'Los límites del deber de obediencia y la libertad inalienable de defender el propio cuerpo',
    text: 'Aunque el poder del soberano es absoluto, Hobbes establece con rigor que existen ciertos derechos primarios que ningún hombre puede entenderse que haya transferido o abandonado por pacto alguno. Según el Capítulo XXI, ¿en cuál de las siguientes situaciones un súbdito conserva la libertad legítima de desobedecer la orden directa del soberano sin incurrir en injusticia?',
    quotePrompt: '«...los pactos de no defender el propio cuerpo de un hombre, son nulos... Si el soberano ordena a un hombre que se mate, hiera o mutile a sí mismo... tiene libertad para desobedecer.»',
    options: [
      {
        id: 'a',
        text: 'Cuando el soberano promulga leyes tributarias que afectan las finanzas personales del súbdito o le imponen un gravamen sobre el consumo suntuario.'
      },
      {
        id: 'b',
        text: 'Cuando el súbdito no está de acuerdo moral o doctrinariamente con la religión civil ordenada públicamente por el Estado.'
      },
      {
        id: 'c',
        text: 'Cuando el soberano le ordena que se mate, se hiera o se mutile a sí mismo, o que no resista a quienes le atacan para arrebatarle violentamente la vida, así como cuando se le exige abstenerse de alimentos, medicina o aire.'
      },
      {
        id: 'd',
        text: 'Cuando el soberano decide declarar una guerra exterior contra una nación limítrofe y el súbdito considera que dicha guerra perjudica las relaciones comerciales.'
      }
    ],
    correctOptionId: 'c',
    points: 1.0,
    explanation: 'El fin supremo de la institución del Estado y de la sumisión voluntaria es la conservación de la vida y la seguridad corporal. Por tal razón, el pacto de no resistir a la violencia contra la propia existencia es nulo por naturaleza: nadie puede pactar matarse o mutilarse a sí mismo. Por ende, si el soberano manda a un hombre que se quite la vida o no se defienda de un ataque mortal inmediato, el súbdito conserva el derecho natural inalienable de desobedecer sin cometer injusticia.',
    hobbesQuote: '«Si el soberano ordena a un hombre (aunque justamente condenado) que se mate, hiera o mutile a sí mismo, o que no resista a quienes le ataquen, o que se abstenga del uso de alimentos, del aire, de la medicina o de cualquiera otra cosa sin la cual no puede vivir, ese hombre tiene libertad para desobedecer... porque el motivo y fin por el cual se establece esta renuncia y transferencia de derecho no es otro sino la seguridad de una persona humana en su vida.» (Capítulo XIV, pág. 77 y Cap. XXI, pág. 129)'
  }
];

export const QUIZ_CONFIG = {
  title: 'Evaluación de Comprensión Lectora: Thomas Hobbes - Leviatán',
  subtitle: 'Cuestionario Analítico sobre la Condición Humana, el Estado de Naturaleza y la Soberanía',
  author: 'Thomas Hobbes (1588-1679)',
  sourceBook: 'Leviatán, o la materia, forma y poder de una república eclesiástica y civil',
  totalQuestions: 5,
  maxScore: 5.0,
  minPassingScore: 3.0,
  timeLimitMinutes: 30,
  timeLimitSeconds: 30 * 60, // 1800s
  pointsPerQuestion: 1.0,
  pdfLocalPath: '/assets/aistudio/Thomas_Hobbes_Leviatan__1__29435438.pdf',
  pdfRelativePath: 'public/assets/aistudio/Thomas_Hobbes_Leviatan__1__29435438.pdf'
};
