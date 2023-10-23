import createDatabase from './InMemoryDatabase';

interface IPokemon {
	id: string;
	attack: number;
	defense: number;
}

const PokemonDB = createDatabase<IPokemon>();

const unsubscribe = PokemonDB.getInstance().onAfterAdd(({ value }) => {
	console.log(value);
});

PokemonDB.getInstance().set({
	id: 'Bulbasaur',
	attack: 50,
	defense: 10
});

unsubscribe();

PokemonDB.getInstance().set({
	id: 'Spinosaur',
	attack: 100,
	defense: 20
});