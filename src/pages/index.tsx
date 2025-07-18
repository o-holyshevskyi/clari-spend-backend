import { Button, HeroUIProvider, Link } from '@heroui/react';

const App = () => {
    return (
        <HeroUIProvider>
            <Link href='/help'>
                <Button>
                    Help
                </Button>
            </Link>
        </HeroUIProvider>
    );
}

export default App;