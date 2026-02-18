import { definePlugin, Millennium, IconsModule, Field, DialogButton, callable } from '@steambrew/client';

// Callable функции для связи с Lua бекендом
const backendLog = callable<[string], string>('BackendLog');
const frontendPing = callable<[], string>('FrontendPing');

// Экспортируем API для webkit (если нужно)
Millennium.exposeObj({ backendLog });

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

  // Не возвращаем настройки - плагин не будет показываться в меню
  return {};
});
