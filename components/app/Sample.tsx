import { ArrowUpRight, BookOpen } from "lucide-react";

interface ProgramCardProps {
    title: string;
    onViewProgram?: () => void;
}

const ProgramCard = ({ title, onViewProgram }: ProgramCardProps) => {
    return (
        <div className="relative bg-muted rounded-2xl p-6 pt-16 min-h-[200px] flex flex-col justify-between">
            {/* Icon Badge */}
            <div className="absolute top-6 right-6 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-foreground leading-tight pr-14">
                {title}
            </h3>

            {/* Action Row */}
            <div className="flex items-center gap-3 mt-4">
                <button
                    onClick={onViewProgram}
                    className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-medium text-sm hover:bg-primary/90 transition-colors"
                >
                    View Program
                </button>
                <button
                    onClick={onViewProgram}
                    className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
                >
                    <ArrowUpRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default ProgramCard;
