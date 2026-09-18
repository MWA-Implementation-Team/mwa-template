import Header from '../ui/Header.js';
import { Page } from '../pages.js';

type LoginPageProps = {
    errorMessage?: string;
};

export const loginPage: Page<LoginPageProps> = {
    Component: LoginPage,
    title: 'MWA | Login',
};

function LoginPage({ errorMessage }: LoginPageProps) {
    return (
        <>
            <Header />

            <form method="POST">
                <h1>Login with your account</h1>
                <input type="text" name="username" placeholder="Username" />
                <button type="submit">Login</button>

                {errorMessage && <p class="error-message">{errorMessage}</p>}
            </form>
        </>
    );
}
