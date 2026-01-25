import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout: React.FC = () => {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <AdminSidebar />
            <main className="flex-1 flex flex-col">
                <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-10 px-8 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                            Master Control
                        </h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* Admin user info could go here */}
                    </div>
                </header>

                <div className="p-8 overflow-y-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
