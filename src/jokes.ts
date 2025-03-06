// Collection of jokes for the application
export interface Joke {
  id: number;
  setup: string;
  punchline: string;
}

export const jokes: Joke[] = [
  {
    id: 1,
    setup: "Why don't scientists trust atoms?",
    punchline: "Because they make up everything!"
  },
  {
    id: 2,
    setup: "How does a computer get drunk?",
    punchline: "It takes screenshots!"
  },
  {
    id: 3,
    setup: "Why did the developer go broke?",
    punchline: "Because he used up all his cache!"
  },
  {
    id: 4,
    setup: "Why do programmers confuse Halloween and Christmas?",
    punchline: "Because Oct(31) === Dec(25)!"
  },
  {
    id: 5,
    setup: "What's a programmer's favorite place to hang out?",
    punchline: "Foo Bar!"
  },
  {
    id: 6,
    setup: "Why did the JavaScript developer wear glasses?",
    punchline: "Because they couldn't C#!"
  },
  {
    id: 7,
    setup: "Why do Java developers wear glasses?",
    punchline: "Because they don't C#!"
  }
];

export default jokes;
