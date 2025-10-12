import MenuButton from "../components/MenuButton";

const AlertPage = () => {
    return (
        <div className="flex flex-col items-center w-screen h-screen p-10 bg-gray-100 text-gray-600 gap-12 overflow-hidden">
            <div className="m-4 bg-white w-full max-w-3xl rounded-4xl shadow-sm flex-1 min-h-0 overflow-hidden">
                <div className="flex flex-col p-6 h-full min-h-0 overflow-auto custom-scroll pb-24">
                    <h2 className="text-center text-3xl font-semibold mb-4">Alerts</h2>
                    <section className="mb-6">
                        <h3 className="text-2xl font-medium mb-3">Today</h3>
                        <div className="space-y-3">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="flex items-start gap-3 p-2">
                                    <img src="/building.svg" className="w-10 h-10 object-cover rounded-full flex-shrink-0" />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-400">10 mins ago</span>
                                        <div className="text-sm">
                                            <span className="font-semibold">Oysloe</span>
                                            <span className="ml-1 break-words">We're excited to have you onboard. You've taken the first step toward smarter shopping and selling. Big things await — stay tuned!</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-2xl font-medium mb-3">Yesterday</h3>
                        <div className="space-y-3">
                            {Array.from({ length: 10 }).map((_, index) => (
                                <div key={index} className="flex items-start gap-3 p-2">
                                    <img src="/building.svg" className="w-10 h-10 object-cover rounded-full flex-shrink-0" />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-400">10 mins ago</span>
                                        <div className="text-sm">
                                            <span className="font-semibold">Oysloe</span>
                                            <span className="ml-1 break-words">We're excited to have you onboard. You've taken the first step toward smarter shopping and selling. Big things await — stay tuned!</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* spacer so last item can scroll clear of the fixed menu */}
                    <div className="h-14" />
                </div>
            </div>

            <MenuButton />
        </div>
    );
}

export default AlertPage;
