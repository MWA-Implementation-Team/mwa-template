import { useState } from 'preact/hooks';
import { Roll, RollMode } from '#src/client/gamble/roll.js';
import { HOUSE_EDGE } from '#src/client/constants.js';

export default function RollComponent() {
    const [ammount, setAmmount] = useState(0);
    const [target, setTarget] = useState(50);
    const [mode, setMode] = useState<RollMode>('under');
    const [busy, setBusy] = useState(false);
    const [history, setHistory] = useState<string[]>([]);

    const winChance = mode === 'over' ? 100 - target : target;
    const multiplier = winChance > 0 ? 100 - HOUSE_EDGE / winChance : 0;
    const payout = ammount * multiplier;

    async function handleRoll(e: any) {
        e.preventDefault();
        if (busy || ammount <= 0 || winChance <= 0) return;

        setBusy(true);
        try {
            const res: any = await Roll({ ammount, target, mode });
            setHistory((h) => [JSON.stringify(res), ...h].slice(0, 20));
        } catch (err: any) {
            // Error logic
        } finally {
            setBusy(false);
        }
    }

    return (
        <div
            style={{
                background: 'var(--sidebar)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                margin: ' 0px auto',
                padding: '16px',
                maxWidth: '420px',
            }}
        >
            <h2 style={{ margin: '0 0 12px', fontSize: '18px' }}>Roll Game</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ display: 'grid', gap: '8px' }}>
                    <label style={{ fontSize: '12px', opacity: 0.7 }}>Ammount</label>
                    <input
                        type="number"
                        min={0}
                        step={0.01}
                        value={ammount}
                        onInput={(e: any) => setAmmount(Number(e.currentTarget.value))}
                        style={{
                            padding: '8px',
                            borderRadius: '6px',
                            border: '1px solid var(--border)',
                        }}
                    />

                    <div style={{ fontSize: '13px', opacity: 0.85 }}>
                        Payout: {payout.toFixed(2)}
                    </div>

                    <button
                        onClick={handleRoll}
                        disabled={busy}
                        style={{
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid var(--border)',
                            fontWeight: 600,
                            cursor: busy ? 'default' : 'pointer',
                            opacity: busy ? '0.7' : '1.0',
                        }}
                    >
                        {busy ? 'Rolling...' : 'Roll'}
                    </button>

                    <div
                        style={{
                            display: 'grid',
                            gap: '12px',
                            padding: '10px',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                        }}
                    >
                        <div
                            style={{
                                display: 'grid',
                                gap: '4px',
                                fontSize: '12px',
                                maxHeight: '120px',
                                overflowY: 'auto',
                            }}
                        >
                            {history.length === 0 ? (
                                <div style={{ opacity: 0.5 }}>No rolls yet</div>
                            ) : (
                                history.map((h, i) => <div key={i}>{h}</div>)
                            )}
                        </div>

                        <div style={{ display: 'grid', gap: '4px' }}>
                            <input
                                type="range"
                                min={1}
                                max={99}
                                value={target}
                                onInput={(e: any) => setTarget(Number(e.currentTarget.value))}
                                style={{ width: '100%' }}
                            />
                            <div style={{ fontSize: '12px', opacity: 0.7 }}>Target {target}</div>
                        </div>

                        <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
                            <label style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                <input
                                    type="radio"
                                    name="mode"
                                    checked={mode === 'under'}
                                    onChange={() => setMode('under')}
                                />
                                Under
                            </label>
                            <label style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                <input
                                    type="radio"
                                    name="mode"
                                    checked={mode === 'over'}
                                    onChange={() => setMode('over')}
                                />
                                Over
                            </label>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '12px',
                                opacity: 0.8,
                            }}
                        >
                            <span>Multiplier {multiplier.toFixed(5)}x</span>
                            <span>Win chance {winChance.toFixed(2)}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
