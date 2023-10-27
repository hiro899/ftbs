import Link from 'next/link';  

export default function HeaderBar() {
    return (
        <div className="fixed w-full bg-gray-100 top-0 flex justify-center py-4 shadow-md">
            <Link href="/">
              <a>
                <img src="/robot_icon.svg" alt="Home" className="h-6 w-6"/>
              </a>
            </Link>
        </div>
    );
}