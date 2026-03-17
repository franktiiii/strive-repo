export interface Quote {
  text: string;
  author: string;
}

export const quotes: Quote[] = [
  { text: "I'm not a businessman, I'm a business, man.", author: "Jay-Z" },
  { text: "The goal is to not go broke.", author: "Dave Ramsey" },
  { text: "Started from the bottom, now we're here.", author: "Drake" },
  { text: "Get rich or die tryin'.", author: "50 Cent" },
  { text: "I got my mind on my money and my money on my mind.", author: "Snoop Dogg" },
  { text: "Mo money, mo problems — unless you budget.", author: "Strive" },
  { text: "I will not lose, for even in defeat, there's a valuable lesson learned.", author: "Jay-Z" },
  { text: "Every next level of your life will demand a different you.", author: "Leonardo DiCaprio" },
  { text: "The grind includes your finances.", author: "Nipsey Hussle" },
  { text: "Invest in yourself. Your career is the engine of your wealth.", author: "Paul Clitheroe" },
  { text: "Rich is not about having — it's about knowing.", author: "Strive" },
  { text: "Stack your bread, stay humble.", author: "Strive" },
  { text: "Scared money don't make none.", author: "Young Jeezy" },
  { text: "The marathon continues — so should your savings.", author: "Strive" },
  { text: "I'd rather invest in real estate than in cars.", author: "Nipsey Hussle" },
  { text: "Protect your peace. Protect your pockets.", author: "Strive" },
  { text: "Having money isn't everything, not having it is.", author: "Kanye West" },
  { text: "Financial freedom is the new flex.", author: "Strive" },
  { text: "Don't go broke trying to look rich.", author: "Strive" },
  { text: "You can't cheat the grind. It knows how much you've invested.", author: "Eric Thomas" },
];

export function getDailyQuote(): Quote {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return quotes[dayOfYear % quotes.length];
}

export function getRandomQuote(): Quote {
  return quotes[Math.floor(Math.random() * quotes.length)];
}
