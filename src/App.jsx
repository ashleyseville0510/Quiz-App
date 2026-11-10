import { useEffect, useState } from 'react';
import './App.css';

const ROUND_SECONDS = 90;
const XP_PER_ANSWER = 100;
const MAX_LEVEL = 100;

const easyQuestions = [
  {
    category: 'SPACE',
    prompt: 'Which planet has a day that lasts longer than its year?',
    answers: ['Mercury', 'Venus', 'Mars', 'Neptune'],
    correct: 'Venus',
    note: 'Venus takes 243 Earth days to rotate once, but only 225 to orbit the Sun.',
  },
  {
    category: 'THE NATURAL WORLD',
    prompt: 'What is the only mammal capable of true, sustained flight?',
    answers: ['Flying squirrel', 'Sugar glider', 'Bat', 'Colugo'],
    correct: 'Bat',
    note: 'Bats are the only mammals that can truly fly; gliders can only coast through the air.',
  },
  {
    category: 'FOOD & DRINK',
    prompt: 'Which of these is botanically a berry?',
    answers: ['Strawberry', 'Raspberry', 'Blackberry', 'Banana'],
    correct: 'Banana',
    note: 'Botanically speaking, bananas are berries. Strawberries are not.',
  },
  {
    category: 'LANGUAGE',
    prompt: 'What is the dot above a lowercase i or j called?',
    answers: ['A tittle', 'An umlaut', 'A cedilla', 'A macron'],
    correct: 'A tittle',
    note: 'That tiny dot has a name: a tittle. The word also means a very small amount.',
  },
  {
    category: 'OUR PLANET',
    prompt: 'Which country has the most natural lakes?',
    answers: ['Finland', 'Canada', 'Sweden', 'Norway'],
    correct: 'Canada',
    note: 'Canada has more lakes than the rest of the world combined.',
  },
  {
    category: 'OUR PLANET',
    prompt: 'What is the largest ocean on Earth?',
    answers: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
    correct: 'Pacific',
    note: 'The Pacific covers more area than all of Earth’s land combined.',
  },
  {
    category: 'NATURE',
    prompt: 'What do caterpillars turn into?',
    answers: ['Beetles', 'Butterflies or moths', 'Dragonflies', 'Spiders'],
    correct: 'Butterflies or moths',
    note: 'Caterpillars are the larval stage of butterflies and moths.',
  },
  {
    category: 'FOOD & DRINK',
    prompt: 'Which fruit is dried to make a prune?',
    answers: ['Plum', 'Apricot', 'Date', 'Fig'],
    correct: 'Plum',
    note: 'Prunes are dried plums, usually varieties that are easy to dry.',
  },
  {
    category: 'SCIENCE',
    prompt: 'How many sides does a hexagon have?',
    answers: ['Five', 'Six', 'Seven', 'Eight'],
    correct: 'Six',
    note: 'The prefix “hex” means six, so a hexagon has six sides.',
  },
  {
    category: 'SPACE',
    prompt: 'Which planet is known as the Red Planet?',
    answers: ['Mars', 'Venus', 'Jupiter', 'Saturn'],
    correct: 'Mars',
    note: 'Iron-rich dust gives Mars its familiar reddish color.',
  },
];

const mediumQuestions = [
  {
    category: 'SCIENCE',
    prompt: 'What is the chemical symbol for iron?',
    answers: ['Ir', 'Fe', 'In', 'I'],
    correct: 'Fe',
    note: 'Fe comes from the Latin name for iron, ferrum.',
  },
  {
    category: 'OUR PLANET',
    prompt: 'What is the largest hot desert in the world?',
    answers: ['Gobi', 'Kalahari', 'Sahara', 'Arabian'],
    correct: 'Sahara',
    note: 'Antarctica is the largest desert overall, but the Sahara is the largest hot desert.',
  },
  {
    category: 'THE NATURAL WORLD',
    prompt: 'What is the largest species of penguin?',
    answers: ['King penguin', 'Emperor penguin', 'Gentoo penguin', 'Adelie penguin'],
    correct: 'Emperor penguin',
    note: 'Emperor penguins can stand over a metre tall.',
  },
  {
    category: 'LANGUAGE',
    prompt: 'Which language has the most native speakers in South America?',
    answers: ['Spanish', 'Portuguese', 'Quechua', 'English'],
    correct: 'Portuguese',
    note: 'Portuguese is the main language of Brazil, South America’s largest country.',
  },
  {
    category: 'SCIENCE',
    prompt: 'How many bones are in the typical adult human body?',
    answers: ['186', '196', '206', '216'],
    correct: '206',
    note: 'Adults typically have 206 bones; babies are born with more that later fuse.',
  },
  {
    category: 'ART & CULTURE',
    prompt: 'In which museum is the Mona Lisa displayed?',
    answers: ['The Prado', 'The Louvre', 'The Uffizi', 'The Met'],
    correct: 'The Louvre',
    note: 'Leonardo da Vinci’s Mona Lisa is displayed at the Louvre in Paris.',
  },
  {
    category: 'SCIENCE',
    prompt: 'What does a light-year measure?',
    answers: ['Time', 'Brightness', 'Distance', 'Temperature'],
    correct: 'Distance',
    note: 'A light-year is the distance light travels in one year.',
  },
  {
    category: 'HISTORY',
    prompt: 'Which ancient civilization built Machu Picchu?',
    answers: ['Maya', 'Aztec', 'Inca', 'Olmec'],
    correct: 'Inca',
    note: 'The Inca built Machu Picchu high in the Andes of present-day Peru.',
  },
  {
    category: 'SCIENCE',
    prompt: 'Which gas makes up most of Earth’s atmosphere?',
    answers: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'],
    correct: 'Nitrogen',
    note: 'Nitrogen makes up about 78 percent of the air around us.',
  },
  {
    category: 'OUR PLANET',
    prompt: 'What is the capital city of New Zealand?',
    answers: ['Auckland', 'Christchurch', 'Wellington', 'Hamilton'],
    correct: 'Wellington',
    note: 'Wellington is New Zealand’s capital and its southernmost major city.',
  },
];

const hardQuestions = [
  {
    category: 'SCIENCE',
    prompt: 'What is the SI unit of electrical resistance?',
    answers: ['Watt', 'Volt', 'Ohm', 'Ampere'],
    correct: 'Ohm',
    note: 'Electrical resistance is measured in ohms, named after physicist Georg Ohm.',
  },
  {
    category: 'SPACE',
    prompt: 'What is the largest moon in our solar system?',
    answers: ['Titan', 'Ganymede', 'Europa', 'Earth’s Moon'],
    correct: 'Ganymede',
    note: 'Jupiter’s moon Ganymede is larger than the planet Mercury.',
  },
  {
    category: 'SCIENCE',
    prompt: 'What is the decimal value of the binary number 1010?',
    answers: ['8', '10', '12', '14'],
    correct: '10',
    note: 'In binary, 1010 represents 1×8 + 0×4 + 1×2 + 0×1, which equals 10.',
  },
  {
    category: 'OUR PLANET',
    prompt: 'Which strait separates Russia and Alaska?',
    answers: ['Bering Strait', 'Davis Strait', 'Bass Strait', 'Strait of Gibraltar'],
    correct: 'Bering Strait',
    note: 'The Bering Strait lies between Siberia and Alaska, connecting two oceans.',
  },
  {
    category: 'LITERATURE',
    prompt: 'Who wrote the epic poem The Divine Comedy?',
    answers: ['Virgil', 'Dante Alighieri', 'Homer', 'Geoffrey Chaucer'],
    correct: 'Dante Alighieri',
    note: 'Dante wrote The Divine Comedy in the early 14th century.',
  },
  {
    category: 'SCIENCE',
    prompt: 'Which element has the atomic number 79?',
    answers: ['Silver', 'Platinum', 'Gold', 'Mercury'],
    correct: 'Gold',
    note: 'Gold has 79 protons in each atom and the chemical symbol Au.',
  },
  {
    category: 'MATHEMATICS',
    prompt: 'What is 2 to the power of 10?',
    answers: ['512', '1,000', '1,024', '2,048'],
    correct: '1,024',
    note: 'Doubling ten times gives 2¹⁰ = 1,024.',
  },
  {
    category: 'HISTORY',
    prompt: 'Which 1648 agreement is associated with the end of the Thirty Years’ War?',
    answers: ['Treaty of Utrecht', 'Peace of Westphalia', 'Treaty of Versailles', 'Congress of Vienna'],
    correct: 'Peace of Westphalia',
    note: 'The Peace of Westphalia was a series of treaties signed in 1648.',
  },
  {
    category: 'SCIENCE',
    prompt: 'What is the name for the boundary around a black hole beyond which light cannot escape?',
    answers: ['Accretion disk', 'Event horizon', 'Schwarzschild ring', 'Singularity line'],
    correct: 'Event horizon',
    note: 'The event horizon marks the point of no return around a black hole.',
  },
  {
    category: 'ART & CULTURE',
    prompt: 'Which composer wrote the opera The Magic Flute?',
    answers: ['Ludwig van Beethoven', 'Joseph Haydn', 'Wolfgang Amadeus Mozart', 'Franz Schubert'],
    correct: 'Wolfgang Amadeus Mozart',
    note: 'Mozart composed The Magic Flute, which premiered in 1791.',
  },
];

const difficultyBands = [
  { name: 'Easy', minimum: 1, maximum: 30 },
  { name: 'Medium', minimum: 31, maximum: 60 },
  { name: 'Hard', minimum: 61, maximum: MAX_LEVEL },
];

const elementSymbols = [
  'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
  'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Y', 'Zr',
  'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe', 'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd',
  'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg',
  'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn', 'Fr', 'Ra', 'Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm',
];

function toRomanNumerals(value) {
  const numerals = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let remainder = value;
  let result = '';

  for (const [amount, numeral] of numerals) {
    while (remainder >= amount) {
      result += numeral;
      remainder -= amount;
    }
  }

  return result;
}

function createQuestion(category, prompt, correct, distractors, note, level) {
  const choices = [String(correct), ...distractors.map(String)];
  const offset = (level - 1) % choices.length;
  return {
    category,
    prompt,
    answers: [...choices.slice(offset), ...choices.slice(0, offset)],
    correct: String(correct),
    note,
  };
}

function getDifficulty(level) {
  return difficultyBands.find((band) => level >= band.minimum && level <= band.maximum);
}

export function getQuestionsForLevel(level) {
  const elementIndex = level - 1;
  const elementDistractors = [7, 19, 37].map((offset) => elementSymbols[(elementIndex + offset) % elementSymbols.length]);
  const mathFirst = level + 4;
  const mathSecond = level * 2 + 3;
  const mathAnswer = mathFirst + mathSecond;
  const romanValue = level + 100;
  const sequenceStart = level * 2 + 1;
  const sequenceStep = (level % 9) + 2;
  const sequenceAnswer = sequenceStart + sequenceStep * 4;
  const distancePerMinute = level * 3 + 7;
  const travelMinutes = (level % 6) + 2;
  const travelDistance = distancePerMinute * travelMinutes;

  return [
    createQuestion('MATHEMATICS', `What is ${mathFirst} + ${mathSecond}?`, mathAnswer, [mathAnswer + 3, mathAnswer - 2, mathAnswer + 7], `${mathFirst} plus ${mathSecond} equals ${mathAnswer}.`, level),
    createQuestion('CHEMISTRY', `What is the chemical symbol for element number ${level}?`, elementSymbols[elementIndex], elementDistractors, `Element number ${level} has the symbol ${elementSymbols[elementIndex]}.`, level + 1),
    createQuestion('ROMAN NUMERALS', `How is ${romanValue} written in Roman numerals?`, toRomanNumerals(romanValue), [toRomanNumerals(romanValue + 1), toRomanNumerals(romanValue - 1), toRomanNumerals(romanValue + 5)], `${romanValue} is written ${toRomanNumerals(romanValue)} in Roman numerals.`, level + 2),
    createQuestion('NUMBER PATTERNS', `What number comes next: ${[0, 1, 2, 3].map((index) => sequenceStart + sequenceStep * index).join(', ')}?`, sequenceAnswer, [sequenceAnswer + sequenceStep, sequenceAnswer - sequenceStep, sequenceAnswer + 2], `The pattern adds ${sequenceStep} each time, so the next number is ${sequenceAnswer}.`, level + 3),
    createQuestion('SPACE', `A satellite travels ${distancePerMinute} km each minute. How far does it travel in ${travelMinutes} minutes?`, travelDistance, [travelDistance + 3, travelDistance + 7, travelDistance - 2], `${distancePerMinute} km per minute for ${travelMinutes} minutes is ${travelDistance} km.`, level + 4),
  ];
}

function readSavedLevel(key, fallback = 1) {
  const savedLevel = Number(window.localStorage.getItem(key));
  return Number.isInteger(savedLevel) && savedLevel >= 1
    ? Math.min(savedLevel, MAX_LEVEL)
    : fallback;
}

function readMissedLevels() {
  try {
    const savedLevels = JSON.parse(window.localStorage.getItem('littleQuizMissedLevels') || '[]');
    return Array.isArray(savedLevels)
      ? savedLevels.filter((level) => Number.isInteger(level) && level >= 1 && level <= MAX_LEVEL)
      : [];
  } catch {
    return [];
  }
}

function App() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState(() => window.localStorage.getItem('littleQuizPlayer') || '');
  const [nameInput, setNameInput] = useState(playerName);
  const [totalXp, setTotalXp] = useState(() => Number(window.localStorage.getItem('littleQuizTotalXp')) || 0);
  const [secondsRemaining, setSecondsRemaining] = useState(ROUND_SECONDS);
  const [isPlaying, setIsPlaying] = useState(false);
  const [unlockedLevel, setUnlockedLevel] = useState(() => readSavedLevel('littleQuizUnlockedLevel'));
  const [selectedLevel, setSelectedLevel] = useState(() => Math.min(
    readSavedLevel('littleQuizSelectedLevel'),
    readSavedLevel('littleQuizUnlockedLevel'),
  ));
  const [missedLevels, setMissedLevels] = useState(readMissedLevels);
  const [roundLevel, setRoundLevel] = useState(selectedLevel);
  const [roundQuestions, setRoundQuestions] = useState(() => getQuestionsForLevel(selectedLevel));
  const [roundMistakes, setRoundMistakes] = useState(0);
  const [roundRecorded, setRoundRecorded] = useState(false);
  const level = isPlaying ? roundLevel : selectedLevel;
  const roundDifficulty = getDifficulty(roundLevel);
  const finished = isPlaying && (questionIndex === roundQuestions.length || secondsRemaining === 0);
  const question = roundQuestions[questionIndex];
  const roundNeedsRetry = roundMistakes > 0 || questionIndex < roundQuestions.length;
  const answeredQuestions = Math.min(questionIndex + (selectedAnswer === null ? 0 : 1), roundQuestions.length);

  useEffect(() => {
    window.localStorage.setItem('littleQuizPlayer', playerName);
  }, [playerName]);

  useEffect(() => {
    window.localStorage.setItem('littleQuizTotalXp', String(totalXp));
  }, [totalXp]);

  useEffect(() => {
    window.localStorage.setItem('littleQuizUnlockedLevel', String(unlockedLevel));
  }, [unlockedLevel]);

  useEffect(() => {
    window.localStorage.setItem('littleQuizSelectedLevel', String(selectedLevel));
  }, [selectedLevel]);

  useEffect(() => {
    window.localStorage.setItem('littleQuizMissedLevels', JSON.stringify(missedLevels));
  }, [missedLevels]);

  useEffect(() => {
    if (!finished || roundRecorded) return;

    const nextLevel = Math.min(roundLevel + 1, MAX_LEVEL);
    setRoundRecorded(true);
    setUnlockedLevel((currentLevel) => Math.max(currentLevel, nextLevel));
    setSelectedLevel(nextLevel);
    setMissedLevels((currentLevels) => {
      const updatedLevels = new Set(currentLevels);
      if (roundNeedsRetry) updatedLevels.add(roundLevel);
      else updatedLevels.delete(roundLevel);
      return [...updatedLevels].sort((first, second) => first - second);
    });
  }, [finished, roundRecorded, roundLevel, roundNeedsRetry]);

  useEffect(() => {
    if (!isPlaying || finished) return undefined;

    const timerId = window.setInterval(() => {
      setSecondsRemaining((remaining) => Math.max(0, remaining - 1));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isPlaying, finished]);

  function beginLevel(levelToStart) {
    const nextLevel = Math.max(1, Math.min(levelToStart, unlockedLevel));
    setSelectedLevel(nextLevel);
    setRoundLevel(nextLevel);
    setRoundQuestions(getQuestionsForLevel(nextLevel));
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setRoundMistakes(0);
    setRoundRecorded(false);
    setSecondsRemaining(ROUND_SECONDS);
    setIsPlaying(true);
  }

  function startRun(event) {
    event.preventDefault();
    const trimmedName = nameInput.trim();
    if (!trimmedName) return;
    setPlayerName(trimmedName);
    beginLevel(selectedLevel);
  }

  function chooseAnswer(answer) {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);
    if (answer === question.correct) {
      setScore((currentScore) => currentScore + XP_PER_ANSWER);
      setTotalXp((currentXp) => currentXp + XP_PER_ANSWER);
    } else {
      setRoundMistakes((currentMistakes) => currentMistakes + 1);
    }
  }

  function goToNextQuestion() {
    setQuestionIndex((currentIndex) => currentIndex + 1);
    setSelectedAnswer(null);
  }

  function returnToSetup(event) {
    event.preventDefault();
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setSecondsRemaining(ROUND_SECONDS);
    setIsPlaying(false);
  }

  const progress = finished ? 100 : (questionIndex / roundQuestions.length) * 100;
  const formattedTime = `0${Math.floor(secondsRemaining / 60)}:${String(secondsRemaining % 60).padStart(2, '0')}`;

  return (
    <main className="quiz-page">
      <header className="topbar">
        <a className="wordmark" href="#home" aria-label="Little Quiz home" onClick={returnToSetup}>
          <span className="wordmark-icon" aria-hidden="true">q</span>
          <span>little quiz</span>
        </a>
        <span className="topbar-note"><span className="status-dot" /> 90-SECOND KNOWLEDGE RUN</span>
      </header>

      <section className="quiz-shell" aria-live="polite">
        <div className="quiz-aside">
          <div className="issue-label"><span>ISSUE NO.</span><strong>014</strong></div>
          <div className="aside-rule" />
          <p className="aside-kicker">A QUICK MIX OF</p>
          <p className="aside-topics">Curious<br />little facts.</p>
          <p className="aside-copy">Five questions across different subjects. Take a guess, learn a thing.</p>
          <div className="aside-stamp" aria-hidden="true"><span>STAY</span><span>CURIOUS</span><b>✳</b></div>
        </div>

        <div className="quiz-content">
          <div className="quiz-meta">
            <span className="eyebrow">{!isPlaying ? 'PLAYER SETUP' : finished ? `${roundDifficulty.name.toUpperCase()} ROUND COMPLETE` : `QUESTION ${String(questionIndex + 1).padStart(2, '0')} / ${String(roundQuestions.length).padStart(2, '0')} · ${roundDifficulty.name.toUpperCase()} ROUND`}</span>
            <div className="game-stats">
              <span className="level-chip"><span className="level-emblem">{level}</span><span>LVL</span></span>
              <span className="score-chip"><span aria-hidden="true">✳</span> {score} <span className="score-label">RUN XP</span></span>
              {isPlaying && <span className={`timer-chip${secondsRemaining <= 15 ? ' is-urgent' : ''}`} role="timer" aria-label="Time remaining">{formattedTime}</span>}
            </div>
          </div>

          {isPlaying && playerName && (
            <div className="player-strip">
              <span className="player-avatar" aria-hidden="true">{playerName.charAt(0).toUpperCase()}</span>
              <div className="player-details">
                <div className="player-level"><strong>{playerName}</strong><span>LEVEL {level} · {getDifficulty(level).name.toUpperCase()}</span></div>
                <div className="level-progress-row">
                  <div className="level-track" role="progressbar" aria-label="Level question progress" aria-valuenow={answeredQuestions} aria-valuemin="0" aria-valuemax={roundQuestions.length}>
                    <span style={{ width: `${(answeredQuestions / roundQuestions.length) * 100}%` }} />
                  </div>
                  <span>{answeredQuestions} / {roundQuestions.length} QUESTIONS</span>
                </div>
              </div>
              <span className="total-xp">{totalXp} <small>TOTAL XP</small></span>
            </div>
          )}

          {isPlaying && <div className="progress-track" role="progressbar" aria-label="Quiz progress" aria-valuenow={finished ? roundQuestions.length : questionIndex} aria-valuemin="0" aria-valuemax={roundQuestions.length}><span style={{ width: `${progress}%` }} /></div>}

          {!isPlaying ? (
            <div className="setup-panel">
              <span className="category-label">A TINY TEST OF EVERYTHING</span>
              <h1>Pick a level. Take your shot.</h1>
              <p className="setup-copy">Each level has five questions and a 90-second timer. Miss one? It’ll be waiting in your retry list.</p>
              <form className="player-form" onSubmit={startRun}>
                <label htmlFor="player-name">YOUR PLAYER NAME</label>
                <input id="player-name" type="text" autoComplete="nickname" maxLength="24" placeholder="What should we call you?" value={nameInput} onChange={(event) => setNameInput(event.target.value)} required />
                <label htmlFor="level-select">CHOOSE LEVEL</label>
                <select id="level-select" value={selectedLevel} onChange={(event) => setSelectedLevel(Number(event.target.value))}>
                  {difficultyBands.map((band) => (
                    <optgroup key={band.name} label={`${band.name} · levels ${band.minimum}–${band.maximum}`}>
                      {Array.from({ length: band.maximum - band.minimum + 1 }, (_, index) => band.minimum + index).map((candidateLevel) => {
                        const isLocked = candidateLevel > unlockedLevel;
                        const isRetry = missedLevels.includes(candidateLevel);
                        const status = isLocked ? ' · Locked' : isRetry ? ' · Retry' : candidateLevel === selectedLevel ? ' · Selected' : '';
                        return <option key={candidateLevel} value={candidateLevel} disabled={isLocked}>Level {candidateLevel}{status}</option>;
                      })}
                    </optgroup>
                  ))}
                </select>
                <button className="next-button start-button" type="submit">Start level {selectedLevel} <span aria-hidden="true">→</span></button>
              </form>
              <p className="setup-record">{unlockedLevel} / {MAX_LEVEL} LEVELS UNLOCKED · {missedLevels.length} TO RETRY · {totalXp} TOTAL XP</p>
            </div>
          ) : finished ? (
            <div className="result-panel">
              <span className="category-label">{secondsRemaining === 0 ? 'TIME IS UP' : `LEVEL ${roundLevel} COMPLETE`}</span>
              <p className="result-score">{score}<span>XP</span></p>
              <h1>{secondsRemaining === 0 ? `Time’s up, ${playerName}.` : roundNeedsRetry ? `Try this level again, ${playerName}.` : `Level cleared, ${playerName}.`}</h1>
              <p className="result-copy">{roundNeedsRetry ? `Level ${roundLevel} is marked for retry. You can replay it from the level list.` : unlockedLevel === MAX_LEVEL && roundLevel === MAX_LEVEL ? 'You’ve reached the final level. Your XP and progress are saved.' : `Level ${roundLevel + 1} is unlocked. Your XP and progress are saved.`}</p>
              <div className="result-actions">
                <button className="next-button" type="button" onClick={returnToSetup}>Choose a level <span aria-hidden="true">↗</span></button>
                {unlockedLevel > roundLevel && <button className="next-button" type="button" onClick={() => beginLevel(roundLevel + 1)}>Play level {roundLevel + 1} <span aria-hidden="true">→</span></button>}
              </div>
            </div>
          ) : (
            <>
              <div className="question-block">
                <span className="category-label">{question.category}</span>
                <h1>{question.prompt}</h1>
              </div>
              <div className="answer-list" role="group" aria-label="Choose an answer">
                {question.answers.map((answer, index) => {
                  const isSelected = selectedAnswer === answer;
                  const isCorrect = answer === question.correct;
                  const stateClass = selectedAnswer === null ? '' : isCorrect ? ' is-correct' : isSelected ? ' is-incorrect' : ' is-muted';
                  return (
                    <button
                      className={`answer-option${stateClass}`}
                      key={answer}
                      type="button"
                      onClick={() => chooseAnswer(answer)}
                      disabled={selectedAnswer !== null}
                      aria-pressed={isSelected}
                    >
                      <span className="answer-letter">{String.fromCharCode(65 + index)}</span>
                      <span className="answer-text">{answer}</span>
                      {selectedAnswer !== null && isCorrect && <span className="answer-mark" aria-label="Correct answer">✓</span>}
                      {isSelected && !isCorrect && <span className="answer-mark" aria-label="Your answer">×</span>}
                    </button>
                  );
                })}
              </div>
              {selectedAnswer !== null && (
                <div className="feedback-row">
                  <p className="feedback-copy"><strong>{selectedAnswer === question.correct ? 'That’s right!' : `Not quite. It’s ${question.correct}.`}</strong> {question.note}</p>
                  <button className="next-button" type="button" onClick={goToNextQuestion}>Next <span aria-hidden="true">→</span></button>
                </div>
              )}
            </>
          )}
          <div className="content-footer"><span>NO PRESSURE. JUST GOOD QUESTIONS.</span><span>01 — 05</span></div>
        </div>
      </section>
      <footer className="page-footer"><span>MADE FOR THE PLEASURE OF KNOWING</span><span>EST. ON A CURIOUS DAY</span></footer>
    </main>
  );
}

export default App;
