import { useState } from 'preact/hooks';
import Header from '../components/Header.js';
import { Page } from '../pages.js';

type HomePageProps = {};

export const homePage: Page<HomePageProps> = {
    Component: HomePage,
    title: 'MWA | Home',
};

function HomePage({}: HomePageProps) {
    const [value, setValue] = useState(0);

    return (
        <>
            <Header />

            <h1>MIF Event: {value}</h1>
            <button onClick={() => setValue(value + 1)}>Increment</button>
            <button onClick={() => setValue(value - 1)}>Decrement</button>
        </>
    );
}
