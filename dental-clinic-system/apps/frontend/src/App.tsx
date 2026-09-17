import { useTranslation } from "react-i18next";

function App() {
  const { t, i18n } = useTranslation();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{t("app.title")}</h1>

      <button onClick={() => i18n.changeLanguage("ar")}>العربية</button>
      <button onClick={() => i18n.changeLanguage("en")} style={{ marginInlineStart: 8 }}>
        English
      </button>

      {/* TODO المرحلة 2: التنقل الفعلي بين صفحات المرضى/المواعيد/الفواتير */}
      <nav style={{ marginTop: "1rem" }}>
        <p>{t("nav.patients")}</p>
        <p>{t("nav.appointments")}</p>
        <p>{t("nav.billing")}</p>
      </nav>
    </div>
  );
}

export default App;
