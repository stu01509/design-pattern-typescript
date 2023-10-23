import createDatabase from './InMemoryDatabase';

interface IPokemon {
	id: string;
	attack: number;
	defense: number;
}

const PokemonDB = createDatabase<IPokemon>();
const pokemonDB = new PokemonDB();
pokemonDB.set({
	id: 'Bulbasaur',
	attack: 50,
	defense: 10
});

console.log(pokemonDB.get('Bulbasaur'));


