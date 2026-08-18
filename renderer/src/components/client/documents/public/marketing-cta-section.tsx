import { Button } from "@/components/ui";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function MarketingCtaSection() {
    return (
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-test-2xl p-8 text-white">
            <p className="text-sm italic mb-4 opacity-90">
                "Tecnologia a favor do seu crescimento."
            </p>
            <h2 className="text-2xl font-bold mb-2">
                Mindgest: O futuro da sua gestão empresarial começa agora.
            </h2>
            <a
                href="https://mindgest.mindware.ao/auth/register"
                target="_blank"
                rel="noopener noreferrer"
            >
                <Button
                    variant="secondary"
                    className="mt-4 bg-white text-purple-700 hover:bg-gray-100"
                >
                    CONHEÇA O MINDGEST
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </a>
        </div>
    );
}
