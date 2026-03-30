import { definePlugin, Millennium, callable } from '@steambrew/client';

const backendLog = callable<[string], string>('BackendLog');
const frontendPing = callable<[], string>('FrontendPing');

Millennium.exposeObj({ backendLog });

export default definePlugin(() => {
  frontendPing();

  Millennium.AddWindowCreateHook?.((context: any) => {
    if (!context.m_strName?.startsWith('SP ')) return;
    const doc = context.m_popup?.document;
    if (!doc?.body) return;
  });

  return {} as any;
});
