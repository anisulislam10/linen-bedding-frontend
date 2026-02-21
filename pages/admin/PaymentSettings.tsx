import React, { useState, useEffect } from 'react';
import {
    CreditCard,
    ShieldCheck,
    Settings2,
    Save,
    AlertCircle,
    CheckCircle2,
    Globe,
    Lock,
    Eye,
    EyeOff,
    Truck
} from 'lucide-react';
import { paymentService } from '../../services/paymentService';
import { GatewaySetting } from '../../types';
import toast from 'react-hot-toast';

interface PaymentSettingsProps {
    isEmbedded?: boolean;
}

const PaymentSettings: React.FC<PaymentSettingsProps> = ({ isEmbedded = false }) => {
    const [settings, setSettings] = useState<GatewaySetting[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const data = await paymentService.getSettings();
            setSettings(data);
        } catch (err: any) {
            toast.error('Failed to load payment settings');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateChange = (gateway: string, field: string, value: any) => {
        setSettings(prev => {
            const exists = prev.find(s => s.gateway === gateway);
            if (exists) {
                return prev.map(s => s.gateway === gateway ? { ...s, [field]: value } : s);
            } else {
                // If the gateway doesn't exist in state, add it with default values
                const newSetting: GatewaySetting = {
                    gateway: gateway as any,
                    mode: 'test',
                    isActive: false,
                    testSecretKey: '',
                    testPublishableKey: '',
                    liveSecretKey: '',
                    livePublishableKey: '',
                    [field]: value
                };
                return [...prev, newSetting];
            }
        });
    };

    const handleSave = async (gateway: string) => {
        const setting = settings.find(s => s.gateway === gateway);
        if (!setting) return;

        try {
            setSaving(true);
            await paymentService.updateSetting(setting);
            toast.success(`${gateway.toUpperCase()} settings saved successfully`);
            fetchSettings();
        } catch (err: any) {
            toast.error(`Error during ${gateway} update`);
        } finally {
            setSaving(false);
        }
    };

    const toggleKeyVisibility = (key: string) => {
        setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const stripeSetting = settings.find(s => s.gateway === 'stripe') || {
        gateway: 'stripe',
        mode: 'test',
        testSecretKey: '',
        testPublishableKey: '',
        liveSecretKey: '',
        livePublishableKey: '',
        isActive: false
    } as GatewaySetting;

    return (
        <div className={`max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ${!isEmbedded ? 'mx-auto' : ''}`}>
            {/* Header */}
            {!isEmbedded && (
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tighter uppercase mb-2">Payment Settings</h1>
                    <p className="text-slate-500 font-medium">Manage financial gateways and transaction settings</p>
                </div>
            )}

            {/* Global Notice */}
            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-[2rem] flex items-start gap-4">
                <ShieldCheck className="w-6 h-6 text-indigo-600 mt-0.5" />
                <div>
                    <p className="text-sm font-bold text-indigo-900 uppercase tracking-tight">Security Active</p>
                    <p className="text-xs text-indigo-600/80 font-medium mt-1 leading-relaxed">
                        Secret keys are encrypted at rest. Test mode allows for sandbox transactions without financial impact.
                        Ensure live keys are only deployed when readiness is verified.
                    </p>
                </div>
            </div>

            {/* Stripe Card */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Stripe Gateway</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`w-2 h-2 rounded-full ${stripeSetting.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stripeSetting.isActive ? 'Active' : 'Inactive'}</span>
                            </div>
                        </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={stripeSetting.isActive}
                            onChange={e => handleUpdateChange('stripe', 'isActive', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600 shadow-inner"></div>
                    </label>
                </div>

                <div className="p-10 space-y-10">
                    {/* Mode Toggle */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mode Configuration</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleUpdateChange('stripe', 'mode', 'test')}
                                className={`p-6 rounded-3xl border-2 transition-all flex items-center justify-center gap-3 ${stripeSetting.mode === 'test'
                                    ? 'border-indigo-600 bg-indigo-50/30 text-indigo-600 shadow-lg shadow-indigo-100'
                                    : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                            >
                                <Settings2 className="w-5 h-5" />
                                <span className="font-bold uppercase tracking-widest text-xs">Test Mode</span>
                            </button>
                            <button
                                onClick={() => handleUpdateChange('stripe', 'mode', 'live')}
                                className={`p-6 rounded-3xl border-2 transition-all flex items-center justify-center gap-3 ${stripeSetting.mode === 'live'
                                    ? 'border-rose-600 bg-rose-50/30 text-rose-600 shadow-lg shadow-rose-100'
                                    : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                            >
                                <Globe className="w-5 h-5" />
                                <span className="font-bold uppercase tracking-widest text-xs">Live Environment</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Test Keys */}
                        <div className="space-y-6 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
                            <h4 className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-widest px-2">
                                <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                                Test Mode API Keys
                            </h4>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Publishable Key</label>
                                    <input
                                        type="text"
                                        value={stripeSetting.testPublishableKey}
                                        onChange={e => handleUpdateChange('stripe', 'testPublishableKey', e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                                        placeholder="pk_test_..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Webhook Secret</label>
                                    <div className="relative">
                                        <input
                                            type={showKeys['testWebhook'] ? 'text' : 'password'}
                                            value={stripeSetting.testWebhookSecret || ''}
                                            onChange={e => handleUpdateChange('stripe', 'testWebhookSecret', e.target.value)}
                                            className="w-full bg-slate-50 border-none rounded-2xl pl-4 pr-12 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                                            placeholder="whsec_..."
                                        />
                                        <button
                                            onClick={() => toggleKeyVisibility('testWebhook')}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showKeys['testWebhook'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secret Key</label>
                                    <div className="relative">
                                        <input
                                            type={showKeys['testSecret'] ? 'text' : 'password'}
                                            value={stripeSetting.testSecretKey}
                                            onChange={e => handleUpdateChange('stripe', 'testSecretKey', e.target.value)}
                                            className="w-full bg-slate-50 border-none rounded-2xl pl-4 pr-12 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                                            placeholder="sk_test_..."
                                        />
                                        <button
                                            onClick={() => toggleKeyVisibility('testSecret')}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showKeys['testSecret'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Live Keys */}
                        <div className="space-y-6">
                            <h4 className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-widest px-2">
                                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                Live Mode API Keys
                            </h4>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Publishable Key</label>
                                    <input
                                        type="text"
                                        value={stripeSetting.livePublishableKey}
                                        onChange={e => handleUpdateChange('stripe', 'livePublishableKey', e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-rose-500 transition-all font-mono"
                                        placeholder="pk_live_..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Webhook Secret</label>
                                    <div className="relative">
                                        <input
                                            type={showKeys['liveWebhook'] ? 'text' : 'password'}
                                            value={stripeSetting.liveWebhookSecret || ''}
                                            onChange={e => handleUpdateChange('stripe', 'liveWebhookSecret', e.target.value)}
                                            className="w-full bg-slate-50 border-none rounded-2xl pl-4 pr-12 py-4 text-sm font-bold focus:ring-2 focus:ring-rose-500 transition-all font-mono"
                                            placeholder="whsec_..."
                                        />
                                        <button
                                            onClick={() => toggleKeyVisibility('liveWebhook')}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showKeys['liveWebhook'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secret Key</label>
                                    <div className="relative">
                                        <input
                                            type={showKeys['liveSecret'] ? 'text' : 'password'}
                                            value={stripeSetting.liveSecretKey}
                                            onChange={e => handleUpdateChange('stripe', 'liveSecretKey', e.target.value)}
                                            className="w-full bg-slate-50 border-none rounded-2xl pl-4 pr-12 py-4 text-sm font-bold focus:ring-2 focus:ring-rose-500 transition-all font-mono"
                                            placeholder="sk_live_..."
                                        />
                                        <button
                                            onClick={() => toggleKeyVisibility('liveSecret')}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showKeys['liveSecret'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => handleSave('stripe')}
                        disabled={saving}
                        className="w-full bg-slate-900 text-white py-6 rounded-3xl font-bold text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-slate-200 hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {saving ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Stripe Settings
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Cash on Delivery Card */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
                            <Truck className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Cash on Delivery</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`w-2 h-2 rounded-full ${(settings.find(s => s.gateway === 'cod')?.isActive) ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{(settings.find(s => s.gateway === 'cod')?.isActive) ? 'Available' : 'Disabled'}</span>
                            </div>
                        </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.find(s => s.gateway === 'cod')?.isActive || false}
                            onChange={e => handleUpdateChange('cod', 'isActive', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-slate-900 shadow-inner"></div>
                    </label>
                </div>

                <div className="p-10 space-y-6">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            Enabling this will allow customers to complete orders without immediate payment.
                            Orders will be marked as "Pending Payment" until manually updated by staff.
                        </p>
                    </div>

                    <button
                        onClick={() => handleSave('cod')}
                        disabled={saving}
                        className="w-full bg-slate-900 text-white py-6 rounded-3xl font-bold text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {saving ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Update COD Status
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Footer Help */}
            <div className="flex items-center justify-center gap-8 py-8">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Lock className="w-4 h-4" />
                    Encrypted Storage
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <CheckCircle2 className="w-4 h-4" />
                    API Connection Verified
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <AlertCircle className="w-4 h-4" />
                    Real-time Sync Active
                </div>
            </div>
        </div>
    );
};

export default PaymentSettings;
