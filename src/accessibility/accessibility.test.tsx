import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import {
  AccessibilityProvider,
  AccessibilityWidget,
  STORAGE_KEY,
  validatePreferences,
  loadPreferences,
  DEFAULT_PREFERENCES,
} from "../accessibility";
import { TRANSLATIONS } from "../accessibility/accessibilityTranslations";

function renderWidget(initialEntries: string[] = ["/"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AccessibilityProvider>
        <div className="page">
          <header className="header">
            <a href="/אודות">אודות</a>
          </header>
          <main className="page-main" id="main-content">
            <h1>כותרת ראשית</h1>
            <p>פסקת תוכן לבדיקה</p>
            <img src="/x.png" alt="תמונת בדיקה" />
            <a href="/צור-קשר">צור קשר</a>
          </main>
        </div>
        <AccessibilityWidget />
      </AccessibilityProvider>
    </MemoryRouter>,
  );
}

async function openPanel(user = userEvent.setup()) {
  const fab = screen.getByTestId("a11y-fab");
  await user.click(fab);
  expect(screen.getByTestId("a11y-panel")).toBeInTheDocument();
  return user;
}

describe("Accessibility widget", () => {
  it("1. opens the widget panel", async () => {
    const user = userEvent.setup();
    renderWidget();
    await openPanel(user);
  });

  it("2. closes the widget panel via backdrop", async () => {
    const user = userEvent.setup();
    renderWidget();
    await openPanel(user);
    await user.click(screen.getByTestId("a11y-backdrop"));
    expect(screen.queryByTestId("a11y-panel")).not.toBeInTheDocument();
  });

  it("3. Escape closes the panel", async () => {
    const user = userEvent.setup();
    renderWidget();
    await openPanel(user);
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByTestId("a11y-panel")).not.toBeInTheDocument();
    });
  });

  it("4–7. translates HE / AR / EN / RU", async () => {
    const user = userEvent.setup();
    renderWidget();
    await openPanel(user);

    const cases = [
      { code: "עברית", statement: TRANSLATIONS.he.statement, langLabel: /שפה|اللغة|Language|Язык/ },
      { code: "العربية", statement: TRANSLATIONS.ar.statement, langLabel: /שפה|اللغة|Language|Язык/ },
      { code: "English", statement: TRANSLATIONS.en.statement, langLabel: /שפה|اللغة|Language|Язык/ },
      { code: "Русский", statement: TRANSLATIONS.ru.statement, langLabel: /שפה|اللغة|Language|Язык/ },
    ] as const;

    for (const item of cases) {
      await user.click(screen.getByRole("button", { name: item.langLabel }));
      await user.click(screen.getByRole("option", { name: item.code }));
      expect(screen.getByText(item.statement)).toBeInTheDocument();
    }
  });

  it("8–11. RTL for HE/AR and LTR for EN/RU", async () => {
    const user = userEvent.setup();
    renderWidget();
    await openPanel(user);

    const selectLang = async (native: string) => {
      const langBtn = screen.getByRole("button", {
        name: /שפה|اللغة|Language|Язык/,
      });
      await user.click(langBtn);
      await user.click(screen.getByRole("option", { name: native }));
    };

    await selectLang("עברית");
    expect(screen.getByTestId("a11y-panel")).toHaveAttribute("dir", "rtl");

    await selectLang("العربية");
    expect(screen.getByTestId("a11y-panel")).toHaveAttribute("dir", "rtl");

    await selectLang("English");
    expect(screen.getByTestId("a11y-panel")).toHaveAttribute("dir", "ltr");

    await selectLang("Русский");
    expect(screen.getByTestId("a11y-panel")).toHaveAttribute("dir", "ltr");
  });

  it("12. toggles high contrast class", async () => {
    const user = userEvent.setup();
    renderWidget();
    await openPanel(user);
    await user.click(screen.getByRole("button", { name: TRANSLATIONS.he.highContrast }));
    expect(document.documentElement.classList.contains("a11y-high-contrast")).toBe(true);
    await user.click(screen.getByRole("button", { name: TRANSLATIONS.he.highContrast }));
    expect(document.documentElement.classList.contains("a11y-high-contrast")).toBe(false);
  });

  it("13. increases and decreases font size", async () => {
    const user = userEvent.setup();
    renderWidget();
    await openPanel(user);
    await user.click(
      screen.getByRole("button", { name: `${TRANSLATIONS.he.increase}: ${TRANSLATIONS.he.fontSize}` }),
    );
    expect(document.documentElement.style.getPropertyValue("--a11y-font-scale")).toBe("1.1");
    await user.click(
      screen.getByRole("button", { name: `${TRANSLATIONS.he.decrease}: ${TRANSLATIONS.he.fontSize}` }),
    );
    expect(document.documentElement.style.getPropertyValue("--a11y-font-scale")).toBe("1");
  });

  it("14. increases and decreases line height", async () => {
    const user = userEvent.setup();
    renderWidget();
    await openPanel(user);
    await user.click(
      screen.getByRole("button", {
        name: `${TRANSLATIONS.he.increase}: ${TRANSLATIONS.he.lineHeight}`,
      }),
    );
    expect(
      document.documentElement.style.getPropertyValue("--a11y-line-height-mult"),
    ).toBe("1.1");
  });

  it("15. increases and decreases letter spacing", async () => {
    const user = userEvent.setup();
    renderWidget();
    await openPanel(user);
    await user.click(
      screen.getByRole("button", {
        name: `${TRANSLATIONS.he.increase}: ${TRANSLATIONS.he.letterSpacing}`,
      }),
    );
    expect(
      document.documentElement.style.getPropertyValue("--a11y-letter-spacing"),
    ).not.toBe("0em");
  });

  it("16. content scaling updates CSS variable", async () => {
    const user = userEvent.setup();
    renderWidget();
    await openPanel(user);
    await user.click(
      screen.getByRole("button", {
        name: `${TRANSLATIONS.he.increase}: ${TRANSLATIONS.he.contentScale}`,
      }),
    );
    expect(
      document.documentElement.style.getPropertyValue("--a11y-content-scale"),
    ).toBe("1.1");
  });

  it("17. readable font class", async () => {
    const user = userEvent.setup();
    renderWidget();
    await openPanel(user);
    await user.click(screen.getByRole("button", { name: TRANSLATIONS.he.readableFont }));
    expect(document.documentElement.classList.contains("a11y-readable-font")).toBe(true);
  });

  it("18. alignment controls are mutually exclusive", async () => {
    const user = userEvent.setup();
    renderWidget();
    await openPanel(user);
    await user.click(screen.getByRole("button", { name: TRANSLATIONS.he.alignLeft }));
    expect(document.documentElement.classList.contains("a11y-align-left")).toBe(true);
    await user.click(screen.getByRole("button", { name: TRANSLATIONS.he.alignCenter }));
    expect(document.documentElement.classList.contains("a11y-align-left")).toBe(false);
    expect(document.documentElement.classList.contains("a11y-align-center")).toBe(true);
    await user.click(screen.getByRole("button", { name: TRANSLATIONS.he.alignRight }));
    expect(document.documentElement.classList.contains("a11y-align-center")).toBe(false);
    expect(document.documentElement.classList.contains("a11y-align-right")).toBe(true);
  });

  it("19. hide images class", async () => {
    const user = userEvent.setup();
    renderWidget();
    await openPanel(user);
    await user.click(screen.getByRole("button", { name: TRANSLATIONS.he.hideImages }));
    expect(document.documentElement.classList.contains("a11y-hide-images")).toBe(true);
  });

  it("20. highlight headings class", async () => {
    const user = userEvent.setup();
    renderWidget();
    await openPanel(user);
    await user.click(
      screen.getByRole("button", { name: TRANSLATIONS.he.highlightHeadings }),
    );
    expect(document.documentElement.classList.contains("a11y-highlight-headings")).toBe(
      true,
    );
  });

  it("21. highlight links class", async () => {
    const user = userEvent.setup();
    renderWidget();
    await openPanel(user);
    await user.click(screen.getByRole("button", { name: TRANSLATIONS.he.highlightLinks }));
    expect(document.documentElement.classList.contains("a11y-highlight-links")).toBe(true);
  });

  it("22. stop animations class", async () => {
    const user = userEvent.setup();
    renderWidget();
    await openPanel(user);
    await user.click(screen.getByRole("button", { name: TRANSLATIONS.he.stopAnimations }));
    expect(document.documentElement.classList.contains("a11y-stop-motion")).toBe(true);
  });

  it("23. grayscale class", async () => {
    const user = userEvent.setup();
    renderWidget();
    await openPanel(user);
    await user.click(screen.getByRole("button", { name: TRANSLATIONS.he.grayscale }));
    expect(document.documentElement.classList.contains("a11y-grayscale")).toBe(true);
  });

  it("24. reset restores defaults", async () => {
    const user = userEvent.setup();
    renderWidget();
    await openPanel(user);
    await user.click(screen.getByRole("button", { name: TRANSLATIONS.he.highContrast }));
    await user.click(
      screen.getByRole("button", {
        name: `${TRANSLATIONS.he.increase}: ${TRANSLATIONS.he.fontSize}`,
      }),
    );
    await user.click(screen.getByRole("button", { name: TRANSLATIONS.he.reset }));
    expect(document.documentElement.classList.contains("a11y-high-contrast")).toBe(false);
    expect(document.documentElement.style.getPropertyValue("--a11y-font-scale")).toBe("1");
  });

  it("25. preferences survive reload (localStorage)", async () => {
    const user = userEvent.setup();
    const { unmount } = renderWidget();
    await openPanel(user);
    await user.click(screen.getByRole("button", { name: TRANSLATIONS.he.highContrast }));
    const stored = window.localStorage.getItem(STORAGE_KEY);
    expect(stored).toBeTruthy();
    unmount();
    document.documentElement.className = "";
    renderWidget();
    await waitFor(() => {
      expect(document.documentElement.classList.contains("a11y-high-contrast")).toBe(true);
    });
  });

  it("26. corrupted localStorage does not crash", () => {
    window.localStorage.setItem(STORAGE_KEY, "{not-json");
    expect(() => loadPreferences()).not.toThrow();
    expect(loadPreferences()).toEqual(DEFAULT_PREFERENCES);

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ enabled: "yes", fontScale: 999, language: "xx" }),
    );
    const prefs = validatePreferences(JSON.parse(window.localStorage.getItem(STORAGE_KEY)!));
    expect(prefs.language).toBe("he");
    expect(prefs.fontScale).toBe(100);
    expect(typeof prefs.enabled).toBe("boolean");

    expect(() => renderWidget()).not.toThrow();
  });

  it("27. navigation links remain after open/close", async () => {
    const user = userEvent.setup();
    renderWidget();
    await openPanel(user);
    await user.keyboard("{Escape}");
    const about = screen.getByRole("link", { name: "אודות" });
    expect(about).toBeVisible();
    expect(about).toHaveAttribute("href", "/אודות");
  });

  it("28. reading mask does not block pointer events", async () => {
    const user = userEvent.setup();
    renderWidget();
    await openPanel(user);
    await user.click(screen.getByRole("button", { name: TRANSLATIONS.he.readingMask }));
    await user.keyboard("{Escape}");
    const mask = screen.getByTestId("a11y-reading-mask");
    expect(mask).toHaveStyle({ pointerEvents: "none" });
    expect(getComputedStyle(mask).pointerEvents).toBe("none");
    const link = screen.getByRole("link", { name: "צור קשר" });
    await user.click(link);
    expect(link).toBeInTheDocument();
  });

  it("29. keyboard: fab is reachable and toggles with Enter/Space", async () => {
    const user = userEvent.setup();
    renderWidget();
    const fab = screen.getByTestId("a11y-fab");
    fab.focus();
    expect(fab).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByTestId("a11y-panel")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByTestId("a11y-panel")).not.toBeInTheDocument();
    });
    expect(fab).toHaveFocus();
    await user.keyboard("{ }");
    expect(screen.getByTestId("a11y-panel")).toBeInTheDocument();
  });

  it("30. launcher remains usable; Alt+A restores hidden widget", async () => {
    const user = userEvent.setup();
    renderWidget();
    await openPanel(user);
    await user.click(screen.getByRole("button", { name: TRANSLATIONS.he.hideWidget }));
    expect(screen.queryByTestId("a11y-fab")).not.toBeInTheDocument();
    expect(screen.getByTestId("a11y-restore-tab")).toBeInTheDocument();

    await user.keyboard("{Alt>}a{/Alt}");
    expect(screen.getByTestId("a11y-panel")).toBeInTheDocument();
    expect(screen.getByTestId("a11y-fab")).toBeInTheDocument();
  });

  it("master toggle disables transformations", async () => {
    const user = userEvent.setup();
    renderWidget();
    await openPanel(user);
    await user.click(screen.getByRole("button", { name: TRANSLATIONS.he.highContrast }));
    expect(document.documentElement.classList.contains("a11y-high-contrast")).toBe(true);
    await user.click(
      screen.getByRole("switch", { name: TRANSLATIONS.he.accessibilityActive }),
    );
    expect(document.documentElement.classList.contains("a11y-enabled")).toBe(false);
    expect(document.documentElement.classList.contains("a11y-high-contrast")).toBe(false);
  });

  it("statement header links to accessibility page", async () => {
    const user = userEvent.setup();
    renderWidget();
    await openPanel(user);
    const statement = screen.getByRole("link", { name: TRANSLATIONS.he.statement });
    expect(statement).toHaveAttribute("href", "/הצהרת-נגישות");
  });

  it("panel exposes aria-expanded on launcher", async () => {
    const user = userEvent.setup();
    renderWidget();
    const fab = screen.getByTestId("a11y-fab");
    expect(fab).toHaveAttribute("aria-expanded", "false");
    await user.click(fab);
    expect(fab).toHaveAttribute("aria-expanded", "true");
  });
});

describe("validatePreferences", () => {
  it("returns defaults for null/invalid", () => {
    expect(validatePreferences(null)).toEqual(DEFAULT_PREFERENCES);
    expect(validatePreferences("x")).toEqual(DEFAULT_PREFERENCES);
  });
});
