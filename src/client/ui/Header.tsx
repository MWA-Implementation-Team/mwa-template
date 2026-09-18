import { useContext } from "preact/hooks";
import { ClientContext } from "../context.js";
import ThemeToggle from "./ThemeToggle.js";

export default function Header() {
    const { username } = useContext(ClientContext);

    return (
        <nav>
            <img src="/Logotipas.png" style={'width:200px;'} />
            <ul>
                <li>
                    <a href="/">Home</a>
                </li>
                <li>
                    {!username ? <a href="/login">Login</a> : <a href="/dashboard">Dashboard ({username})</a>}
                </li>
            </ul>
            <ThemeToggle />
        </nav>
    );
}
