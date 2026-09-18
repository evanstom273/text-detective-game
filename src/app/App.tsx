import { PwaControls } from './PwaControls';

export function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <section className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Text Detective Game</h1>
        <p className="mt-3 text-slate-400">Case Generator — development build</p>
        <PwaControls />
      </section>
    </main>
  );
}
