export type AnswerOption = {
  answerText: string;
  isCorrect: boolean;
};

export type Question = {
  questionText: string;
  answerOptions: AnswerOption[];
  johnSnark: string;
};

export const quizQuestions: Question[] = [
  {
    questionText:
      "John reheats leftover fish in the office microwave. The break room now smells like the ocean met a dumpster. What's the best HR move?",
    answerOptions: [
      { answerText: "Send a polite Slack message to John about office odors.", isCorrect: true },
      { answerText: "Put up a passive-aggressive sign: 'No Fish Zone.'", isCorrect: false },
      { answerText: "Secretly replace his lunch with tofu.", isCorrect: false },
      { answerText: "Nothing. The scent builds character.", isCorrect: false },
    ],
    johnSnark: "Mmm, Eau de Atlantic. Next time I’ll bring crab legs for Ben—he loves a pungent workspace.",
  },
  {
    questionText:
      "Spencer forwards a 'hilarious' desNutz meme to the entire office. What’s your compliant response?",
    answerOptions: [
      { answerText: "Remind Spencer that HR frowns on group nut jokes.", isCorrect: true },
      { answerText: "Reply-all with your own meme escalation.", isCorrect: false },
      { answerText: "Print it out and hang it on the fridge.", isCorrect: false },
      { answerText: "Ignore it—laughter is the best policy.", isCorrect: false },
    ],
    johnSnark: "desNutz humor, classic. If only HR’s sense of humor was as robust as panladen’s lunchbox.",
  },
  {
    questionText:
      "beningitis brings his emotional support ferret to a meeting. It escapes and chews through the big cheese’s laptop cord. What now?",
    answerOptions: [
      { answerText: "Ask beningitis to keep pets at home in future.", isCorrect: true },
      { answerText: "Nominate the ferret for Employee of the Month.", isCorrect: false },
      { answerText: "Blame Spencer—he looks suspicious.", isCorrect: false },
      { answerText: "Buy everyone new laptops.", isCorrect: false },
    ],
    johnSnark: "That ferret’s got ambition. Unlike jimothy, who can’t even chew through a TPS report.",
  },
  {
    questionText:
      "panladen hosts a lunchtime seminar on 'Efficiency Hacks' and locks everyone in until they meditate. What’s the correct course?",
    answerOptions: [
      { answerText: "Remind panladen about voluntary participation.", isCorrect: true },
      { answerText: "Hide under your desk until he leaves.", isCorrect: false },
      { answerText: "Start a rival seminar: 'Napping 101.'", isCorrect: false },
      { answerText: "Join in and achieve office enlightenment.", isCorrect: false },
    ],
    johnSnark: "Meditation is great, but forced Zen? Even the young boy escaped out the window.",
  },
  {
    questionText:
      "jimothy sets his Slack status to 'Working hard or hardly working?' during the quarterly review. What’s the most HR-approved reaction?",
    answerOptions: [
      { answerText: "Suggest a more professional status for review days.", isCorrect: true },
      { answerText: "Change your status to 'Definitely hardly working.'", isCorrect: false },
      { answerText: "Congratulate jimothy on his candor.", isCorrect: false },
      { answerText: "Ask desNutz to make a meme about it.", isCorrect: false },
    ],
    johnSnark: "I’ll update mine to ‘In compliance, barely.’ HR loves a good status… update.",
  },
  {
    questionText:
      "The young boy brings in homemade chili so spicy even John cries. How should HR handle this culinary assault?",
    answerOptions: [
      { answerText: "Ask for a warning label next time.", isCorrect: true },
      { answerText: "Report the chili to OSHA.", isCorrect: false },
      { answerText: "Challenge the big cheese to a chili-off.", isCorrect: false },
      { answerText: "Add ghost peppers and serve revenge.", isCorrect: false },
    ],
    johnSnark: "That chili left me more scorched than beningitis after salsa night.",
  },
];