import { FaGithub } from "react-icons/fa";

export default function Legal() {
    return (
        <footer className="text-[0.8rem] text-twiterMuted">
            <ul className="text-center">
                <li className="inline-block mr-2 hover:underline">
                    <a href="https://github.com/fatiharapoglu/twitter" target="_blank">
                        Terms of Service
                    </a>
                </li>
                <li className="inline-block mr-2 hover:underline">
                    <a href="https://github.com/fatiharapoglu/twitter" target="_blank">
                        Privacy Policy
                    </a>
                </li>
                <li className="inline-block mr-2 hover:underline">
                    <a href="https://github.com/fatiharapoglu/twitter" target="_blank">
                        Cookie Policy
                    </a>
                </li>
                <li className="inline-block mr-2 hover:underline">
                    <a href="https://github.com/fatiharapoglu/twitter" target="_blank">
                        Imprint
                    </a>
                </li>
                <li className="inline-block mr-2 hover:underline">
                    <a href="https://github.com/fatiharapoglu/twitter" target="_blank">
                        Accessibility
                    </a>
                </li>
            </ul>
            <div className="text-center flex flex-col pt-4 gap-2 transition 0.2s ease-in-out">
                <a href="https://fatiharapoglu.dev" target="_blank" className="hover:text-twitterBlue">
                    &copy; 2023 | Fatih Arapoğlu
                </a>
                <a href="https://github.com/fatiharapoglu" target="_blank" className="hover:text-twitterBlue">
                    <FaGithub className="text-twitterBlack transition 0.5s ease-in-out text-[2rem] hover:rotate-180" />
                </a>
            </div>
        </footer>
    );
}
