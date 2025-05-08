import Sidebar from "./Sidebar";

export default function ERPLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex bg-gradient-to-t from-purple-900 via-blue-900 to-black">
            <Sidebar />
            <main className="flex-1 p-8">
                <div className="bg-white/10 rounded-lg p-6 shadow-lg h-full text-white">
                    {children}
                </div>
            </main>
        </div>
    )
}