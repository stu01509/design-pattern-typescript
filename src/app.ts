import createDatabase from './InMemoryDatabase';

interface IPokemon {
	id: string;
	attack: number;
	defense: number;
}

const PokemonDB = createDatabase<IPokemon>();

PokemonDB.getInstance().set({
	id: 'Bulbasaur',
	attack: 50,
	defense: 10
});

console.log(PokemonDB.getInstance().get('Bulbasaur'));
