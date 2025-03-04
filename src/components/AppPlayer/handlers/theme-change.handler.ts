import { THEME_KEY } from "../../../shared/keys";

interface ThemeChangeHandlerProps {
  value: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
}

export const handleThemeChange = ({
  value,
  setTheme,
}: ThemeChangeHandlerProps) => {
  setTheme(value);
  localStorage.setItem(THEME_KEY, value);
};
