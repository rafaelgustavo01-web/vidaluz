export const TAROT_CARDS = [
  // Arcanos Maiores
  "O Louco", "O Mago", "A Sacerdotisa", "A Imperatriz", "O Imperador", "O Hierofante", "Os Enamorados", "O Carro", "A Força", "O Eremita", "A Roda da Fortuna", "A Justiça", "O Pendurado", "A Morte", "A Temperança", "O Diabo", "A Torre", "A Estrela", "A Lua", "O Sol", "O Julgamento", "O Mundo",
  // Paus
  "Ás de Paus", "Dois de Paus", "Três de Paus", "Quatro de Paus", "Cinco de Paus", "Seis de Paus", "Sete de Paus", "Oito de Paus", "Nove de Paus", "Dez de Paus", "Valete de Paus", "Cavaleiro de Paus", "Rainha de Paus", "Rei de Paus",
  // Copas
  "Ás de Copas", "Dois de Copas", "Três de Copas", "Quatro de Copas", "Cinco de Copas", "Seis de Copas", "Sete de Copas", "Oito de Copas", "Nove de Copas", "Dez de Copas", "Valete de Copas", "Cavaleiro de Copas", "Rainha de Copas", "Rei de Copas",
  // Espadas
  "Ás de Espadas", "Dois de Espadas", "Três de Espadas", "Quatro de Espadas", "Cinco de Espadas", "Seis de Espadas", "Sete de Espadas", "Oito de Espadas", "Nove de Espadas", "Dez de Espadas", "Valete de Espadas", "Cavaleiro de Espadas", "Rainha de Espadas", "Rei de Espadas",
  // Ouros
  "Ás de Ouros", "Dois de Ouros", "Três de Ouros", "Quatro de Ouros", "Cinco de Ouros", "Seis de Ouros", "Sete de Ouros", "Oito de Ouros", "Nove de Ouros", "Dez de Ouros", "Valete de Ouros", "Cavaleiro de Ouros", "Rainha de Ouros", "Rei de Ouros"
];

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ /g, "-")
    .replace("hierofante", "papa")
    .replace("pendurado", "enforcado");
};


export const URL_MAP: Record<string, string> = {
  // Arcanos Maiores
  "o-louco": "https://upload.wikimedia.org/wikipedia/commons/c/c0/The_Fool_%28Rider-Waite_Smith_tarot_deck%29.png",
  "o-mago": "https://upload.wikimedia.org/wikipedia/commons/5/57/The_Magician_%28Rider-Waite_Smith_tarot_deck%29.png",
  "a-sacerdotisa": "https://upload.wikimedia.org/wikipedia/commons/0/0d/The_High_Priestess_%28Rider-Waite_Smith_tarot_deck%29.png",
  "a-imperatriz": "https://upload.wikimedia.org/wikipedia/commons/f/fb/The_Empress_%28Rider-Waite_Smith_tarot_deck%29.png",
  "o-imperador": "https://upload.wikimedia.org/wikipedia/commons/f/f8/The_Emperor_%28Rider-Waite_Smith_tarot_deck%29.png",
  "o-hierofante": "https://upload.wikimedia.org/wikipedia/commons/f/fe/The_Hierophant_%28Rider-Waite_Smith_tarot_deck%29.png",
  "o-papa": "https://upload.wikimedia.org/wikipedia/commons/f/fe/The_Hierophant_%28Rider-Waite_Smith_tarot_deck%29.png",
  "os-enamorados": "https://upload.wikimedia.org/wikipedia/commons/1/1b/The_Lovers_%28Rider-Waite_Smith_tarot_deck%29.png",
  "o-carro": "https://upload.wikimedia.org/wikipedia/commons/8/88/The_Chariot_%28Rider-Waite_Smith_tarot_deck%29.png",
  "a-forca": "https://upload.wikimedia.org/wikipedia/commons/7/74/Strength_%28Rider-Waite_Smith_tarot_deck%29.png",
  "o-eremita": "https://upload.wikimedia.org/wikipedia/commons/1/1a/The_Hermit_%28Rider-Waite_Smith_tarot_deck%29.png",
  "a-roda-da-fortuna": "https://upload.wikimedia.org/wikipedia/commons/0/03/Wheel_of_Fortune_%28Rider-Waite_Smith_tarot_deck%29.png",
  "a-justica": "https://upload.wikimedia.org/wikipedia/commons/8/85/Justice_%28Rider-Waite_Smith_tarot_deck%29.png",
  "o-pendurado": "https://upload.wikimedia.org/wikipedia/commons/8/8e/The_Hanged_Man_%28Rider-Waite_Smith_tarot_deck%29.png",
  "o-enforcado": "https://upload.wikimedia.org/wikipedia/commons/8/8e/The_Hanged_Man_%28Rider-Waite_Smith_tarot_deck%29.png",
  "a-morte": "https://upload.wikimedia.org/wikipedia/commons/d/d3/Death_%28Rider-Waite_Smith_tarot_deck%29.png",
  "a-temperanca": "https://upload.wikimedia.org/wikipedia/commons/6/66/Temperance_%28Rider-Waite_Smith_tarot_deck%29.png",
  "o-diabo": "https://upload.wikimedia.org/wikipedia/commons/b/b5/The_Devil_%28Rider-Waite_Smith_tarot_deck%29.png",
  "a-torre": "https://upload.wikimedia.org/wikipedia/commons/8/8c/The_Tower_%28Rider-Waite_Smith_tarot_deck%29.png",
  "a-estrela": "https://upload.wikimedia.org/wikipedia/commons/0/09/The_Star_%28Rider-Waite_Smith_tarot_deck%29.png",
  "a-lua": "https://upload.wikimedia.org/wikipedia/commons/1/18/The_Moon_%28Rider-Waite_Smith_tarot_deck%29.png",
  "o-sol": "https://upload.wikimedia.org/wikipedia/commons/0/0a/The_Sun_%28Rider-Waite_Smith_tarot_deck%29.png",
  "o-julgamento": "https://upload.wikimedia.org/wikipedia/commons/2/2e/Judgement_%28Rider-Waite_Smith_tarot_deck%29.png",
  "o-mundo": "https://upload.wikimedia.org/wikipedia/commons/9/95/The_World_%28Rider-Waite_Smith_tarot_deck%29.png",
  
  // Paus (Wands)
  "as-de-paus": "https://upload.wikimedia.org/wikipedia/commons/e/e5/Ace_of_Wands_%28Rider-Waite_Smith_tarot_deck%29.png",
  "dois-de-paus": "https://upload.wikimedia.org/wikipedia/commons/9/97/Two_of_Wands_%28Rider-Waite_Smith_tarot_deck%29.png",
  "tres-de-paus": "https://upload.wikimedia.org/wikipedia/commons/3/31/Three_of_Wands_%28Rider-Waite_Smith_tarot_deck%29.png",
  "quatro-de-paus": "https://upload.wikimedia.org/wikipedia/commons/0/0c/Four_of_Wands_%28Rider-Waite_Smith_tarot_deck%29.png",
  "cinco-de-paus": "https://upload.wikimedia.org/wikipedia/commons/4/42/Five_of_Wands_%28Rider-Waite_Smith_tarot_deck%29.png",
  "seis-de-paus": "https://upload.wikimedia.org/wikipedia/commons/0/0e/Six_of_Wands_%28Rider-Waite_Smith_tarot_deck%29.png",
  "sete-de-paus": "https://upload.wikimedia.org/wikipedia/commons/7/7f/Seven_of_Wands_%28Rider-Waite_Smith_tarot_deck%29.png",
  "oito-de-paus": "https://upload.wikimedia.org/wikipedia/commons/0/0a/Eight_of_Wands_%28Rider-Waite_Smith_tarot_deck%29.png",
  "nove-de-paus": "https://upload.wikimedia.org/wikipedia/commons/b/b7/Nine_of_Wands_%28Rider-Waite_Smith_tarot_deck%29.png",
  "dez-de-paus": "https://upload.wikimedia.org/wikipedia/commons/7/7c/Ten_of_Wands_%28Rider-Waite_Smith_tarot_deck%29.png",
  "valete-de-paus": "https://upload.wikimedia.org/wikipedia/commons/3/34/Page_of_Wands_%28Rider-Waite_Smith_tarot_deck%29.png",
  "cavaleiro-de-paus": "https://upload.wikimedia.org/wikipedia/commons/2/2a/Knight_of_Wands_%28Rider-Waite_Smith_tarot_deck%29.png",
  "rainha-de-paus": "https://upload.wikimedia.org/wikipedia/commons/8/8b/Queen_of_Wands_%28Rider-Waite_Smith_tarot_deck%29.png",
  "rei-de-paus": "https://upload.wikimedia.org/wikipedia/commons/e/e1/King_of_Wands_%28Rider-Waite_Smith_tarot_deck%29.png",

  // Copas (Cups)
  "as-de-copas": "https://upload.wikimedia.org/wikipedia/commons/8/86/Ace_of_Cups_%28Rider-Waite_Smith_tarot_deck%29.png",
  "dois-de-copas": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Two_of_Cups_%28Rider-Waite_Smith_tarot_deck%29.png",
  "tres-de-copas": "https://upload.wikimedia.org/wikipedia/commons/9/9e/Three_of_Cups_%28Rider-Waite_Smith_tarot_deck%29.png",
  "quatro-de-copas": "https://upload.wikimedia.org/wikipedia/commons/c/cd/Four_of_Cups_%28Rider-Waite_Smith_tarot_deck%29.png",
  "cinco-de-copas": "https://upload.wikimedia.org/wikipedia/commons/3/34/Five_of_Cups_%28Rider-Waite_Smith_tarot_deck%29.png",
  "seis-de-copas": "https://upload.wikimedia.org/wikipedia/commons/f/f7/Six_of_Cups_%28Rider-Waite_Smith_tarot_deck%29.png",
  "sete-de-copas": "https://upload.wikimedia.org/wikipedia/commons/5/5e/Seven_of_Cups_%28Rider-Waite_Smith_tarot_deck%29.png",
  "oito-de-copas": "https://upload.wikimedia.org/wikipedia/commons/0/0b/Eight_of_Cups_%28Rider-Waite_Smith_tarot_deck%29.png",
  "nove-de-copas": "https://upload.wikimedia.org/wikipedia/commons/8/86/Nine_of_Cups_%28Rider-Waite_Smith_tarot_deck%29.png",
  "dez-de-copas": "https://upload.wikimedia.org/wikipedia/commons/9/9c/Ten_of_Cups_%28Rider-Waite_Smith_tarot_deck%29.png",
  "valete-de-copas": "https://upload.wikimedia.org/wikipedia/commons/5/5e/Page_of_Cups_%28Rider-Waite_Smith_tarot_deck%29.png",
  "cavaleiro-de-copas": "https://upload.wikimedia.org/wikipedia/commons/1/16/Knight_of_Cups_%28Rider-Waite_Smith_tarot_deck%29.png",
  "rainha-de-copas": "https://upload.wikimedia.org/wikipedia/commons/a/a4/Queen_of_Cups_%28Rider-Waite_Smith_tarot_deck%29.png",
  "rei-de-copas": "https://upload.wikimedia.org/wikipedia/commons/4/4e/King_of_Cups_%28Rider-Waite_Smith_tarot_deck%29.png",

  // Espadas (Swords)
  "as-de-espadas": "https://upload.wikimedia.org/wikipedia/commons/f/fd/One_of_Swords_%28Rider-Waite_Smith_tarot_deck%29.png",
  "dois-de-espadas": "https://upload.wikimedia.org/wikipedia/commons/7/7d/Two_of_Swords_%28Rider-Waite_Smith_tarot_deck%29.png",
  "tres-de-espadas": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Three_of_Swords_%28Rider-Waite_Smith_tarot_deck%29.png",
  "quatro-de-espadas": "https://upload.wikimedia.org/wikipedia/commons/6/61/Four_of_Swords_%28Rider-Waite_Smith_tarot_deck%29.png",
  "cinco-de-espadas": "https://upload.wikimedia.org/wikipedia/commons/4/42/Five_of_Swords_%28Rider-Waite_Smith_tarot_deck%29.png",
  "seis-de-espadas": "https://upload.wikimedia.org/wikipedia/commons/f/f4/Six_of_Swords_%28Rider-Waite_Smith_tarot_deck%29.png",
  "sete-de-espadas": "https://upload.wikimedia.org/wikipedia/commons/0/04/Seven_of_Swords_%28Rider-Waite_Smith_tarot_deck%29.png",
  "oito-de-espadas": "https://upload.wikimedia.org/wikipedia/commons/b/be/Eight_of_Swords_%28Rider-Waite_Smith_tarot_deck%29.png",
  "nove-de-espadas": "https://upload.wikimedia.org/wikipedia/commons/1/1f/Nine_of_Swords_%28Rider-Waite_Smith_tarot_deck%29.png",
  "dez-de-espadas": "https://upload.wikimedia.org/wikipedia/commons/6/62/Ten_of_Swords_%28Rider-Waite_Smith_tarot_deck%29.png",
  "valete-de-espadas": "https://upload.wikimedia.org/wikipedia/commons/e/ef/Page_of_Swords_%28Rider-Waite_Smith_tarot_deck%29.png",
  "cavaleiro-de-espadas": "https://upload.wikimedia.org/wikipedia/commons/f/f1/Knight_of_Swords_%28Rider-Waite_Smith_tarot_deck%29.png",
  "rainha-de-espadas": "https://upload.wikimedia.org/wikipedia/commons/b/b1/Queen_of_Swords_%28Rider-Waite_Smith_tarot_deck%29.png",
  "rei-de-espadas": "https://upload.wikimedia.org/wikipedia/commons/8/85/King_of_Swords_%28Rider-Waite_Smith_tarot_deck%29.png",

  // Ouros (Pentacles)
  "as-de-ouros": "https://upload.wikimedia.org/wikipedia/commons/5/54/One_of_Pentacles_%28Rider-Waite_Smith_tarot_deck%29.png",
  "dois-de-ouros": "https://upload.wikimedia.org/wikipedia/commons/1/14/Two_of_Pentacles_%28Rider-Waite_Smith_tarot_deck%29.png",
  "tres-de-ouros": "https://upload.wikimedia.org/wikipedia/commons/e/ea/Three_of_Pentacles_%28Rider-Waite_Smith_tarot_deck%29.png",
  "quatro-de-ouros": "https://upload.wikimedia.org/wikipedia/commons/c/c9/Four_of_Pentacles_%28Rider-Waite_Smith_tarot_deck%29.png",
  "cinco-de-ouros": "https://upload.wikimedia.org/wikipedia/commons/e/e7/Five_of_Pentacles_%28Rider-Waite_Smith_tarot_deck%29.png",
  "seis-de-ouros": "https://upload.wikimedia.org/wikipedia/commons/c/cf/Six_of_Pentacles_%28Rider-Waite_Smith_tarot_deck%29.png",
  "sete-de-ouros": "https://upload.wikimedia.org/wikipedia/commons/1/10/Seven_of_Pentacles_%28Rider-Waite_Smith_tarot_deck%29.png",
  "oito-de-ouros": "https://upload.wikimedia.org/wikipedia/commons/4/45/Eight_of_Pentacles_%28Rider-Waite_Smith_tarot_deck%29.png",
  "nove-de-ouros": "https://upload.wikimedia.org/wikipedia/commons/5/55/Nine_of_Pentacles_%28Rider-Waite_Smith_tarot_deck%29.png",
  "dez-de-ouros": "https://upload.wikimedia.org/wikipedia/commons/f/f3/Ten_of_Pentacles_%28Rider-Waite_Smith_tarot_deck%29.png",
  "valete-de-ouros": "https://upload.wikimedia.org/wikipedia/commons/8/86/Page_of_Pentacles_%28Rider-Waite_Smith_tarot_deck%29.png",
  "cavaleiro-de-ouros": "https://upload.wikimedia.org/wikipedia/commons/d/d8/Knight_of_Pentacles_%28Rider-Waite_Smith_tarot_deck%29.png",
  "rainha-de-ouros": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Queen_of_Pentacles_%28Rider-Waite_Smith_tarot_deck%29.png",
  "rei-de-ouros": "https://upload.wikimedia.org/wikipedia/commons/a/a5/King_of_Pentacles_%28Rider-Waite_Smith_tarot_deck%29.png",
};

export const getCardImageUrl = (name: string) => {
  const slug = slugify(name);
  const url = URL_MAP[slug];
  
  if (url) {
    return url;
  }
  
  // Fallback
  return `https://upload.wikimedia.org/wikipedia/commons/c/c0/The_Fool_%28Rider-Waite_Smith_tarot_deck%29.png`;
};

export const POSITIONS = ["Passado / Condição", "Presente / Desafio", "Futuro / Conselho"];
