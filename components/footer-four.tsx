import { LogoIcon } from '@/components/logo'
import Link from 'next/link'

const links = [
    {
        title: 'Privacy Policy',
        href: 'https://www.notion.so/Privacy-Policy-2b20303a25c180c4aa5ccde294b8011b?source=copy_link',
    },
    {
        title: 'Terms of Service',
        href: 'https://www.notion.so/Terms-of-Service-2b20303a25c180b0b76ede3bb8defc72?source=copy_link',
    },
    
]

export default function FooterSection() {
    return (
        <footer className="bg-accent border-b py-12">
            <div className="mx-auto max-w-5xl px-6">
                <div className="flex flex-wrap justify-between gap-12">
                    <div className="order-last flex items-center gap-3 md:order-first">
                        <Link
                            href="/"
                            aria-label="go home">
                            <LogoIcon />
                        </Link>
                        <span className="text-muted-foreground block text-center text-sm">© {new Date().getFullYear()} NotePilot, All rights reserved</span>
                    </div>

                    <div className="order-first flex flex-wrap gap-x-6 gap-y-4 md:order-last">
                        {links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                className="text-muted-foreground text-sm hover:text-primary block duration-150">
                                <span>{link.title}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
