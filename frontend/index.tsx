import { definePlugin, Millennium, IconsModule, Field, DialogButton, callable } from '@steambrew/client';

// Callable функции для связи с Lua бекендом
const getDotaStatsStratz = callable<[string], string>('GetDotaStatsStratz');
const backendLog = callable<[string], string>('BackendLog');
const frontendPing = callable<[], string>('FrontendPing');

// Класс для экспорта в глобальный контекст (если нужно для webkit)
class DotaStatsApi {
  static async getStats(steamAccountId: string) {
    return await getDotaStatsStratz(steamAccountId);
  }

  static async log(message: string) {
    return await backendLog(message);
  }
}

// Экспортируем класс в глобальный контекст
Millennium.exposeObj({ DotaStatsApi });

// Компонент настроек плагина
const SettingsContent = () => {
  return (
    <Field 
      label="Dota 2 Stats Settings" 
      description="Configure your Dota 2 statistics widget display."
      bottomSeparator="standard"
    >
      <DialogButton onClick={() => console.log('Settings clicked')}>
        Open Settings
      </DialogButton>
    </Field>
  );
};

export default definePlugin(() => {
  console.log('[DotaStats] Plugin loading...');

  // Пинг бекенда при загрузке
  frontendPing().then((result) => {
    console.log('[DotaStats] Backend ping result:', result);
  });

  // Хук на создание окна Steam
  Millennium.AddWindowCreateHook?.((context: any) => {
    if (!context.m_strName?.startsWith('SP ')) return;
    
    const doc = context.m_popup?.document;
    if (!doc?.body) return;
    
    console.log('[DotaStats] Window created:', context.m_strName);
    
    // Здесь логика инъекции виджета на страницу профиля
    // Webkit модуль будет обрабатывать отображение на странице профиля
  });

  return {
    title: 'Dota 2 Stats',
    icon: <IconsModule.Settings />,
    content: <SettingsContent />,
  };
});
