
export default function WebviewLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-4xl mx-auto prose prose-invert prose-lg max-w-none">
                {children}
            </div>
        </div>
    );
}
