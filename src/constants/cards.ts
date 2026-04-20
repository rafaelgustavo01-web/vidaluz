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

export const getCardImageUrl = (name: string) => {
  const slug = slugify(name);
  return `/assets/${slug}.jpg`;
};

export const POSITIONS = ["Passado / Condição", "Presente / Desafio", "Futuro / Conselho"];
