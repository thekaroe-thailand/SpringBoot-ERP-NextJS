export default function Dashboard() {
    return (
        <div>
            <div className="text-2xl font-bold mb-2">Dashboard</div>
            <div className="flex gap-2 text-end">
                <div className="flex flex-col gap-2 bg-blue-500 text-white rounded-lg p-2 w-full">
                    <div>ยอดการผลิต (ชิ้น)</div>
                    <div>100</div>
                </div>
                <div className="flex flex-col gap-2 bg-green-700 text-white rounded-lg p-2 w-full">
                    <div>ยอดการขาย (ชิ้น)</div>
                    <div>100</div>
                </div>
                <div className="flex flex-col gap-2 bg-yellow-500 text-white rounded-lg p-2 w-full">
                    <div>สินค้า</div>
                    <div>100</div>
                </div>
                <div className="flex flex-col gap-2 bg-red-500 text-white rounded-lg p-2 w-full">
                    <div>Loss (ชิ้น)</div>
                    <div>100</div>
                </div>
            </div>
        </div>
    );
}