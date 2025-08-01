import * as React from 'react';

function usePrevious<T>(value: T) {
  const ref = React.useRef<T>();

  React.useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

export function useTabs<K extends string>(
  tabs: K[],
  defaultTab: K | null | undefined = tabs.length > 0 ? tabs[0] : null,
) {
  const state = React.useState(defaultTab);
  const [selectedTab, setSelectedTab] = state;

  const activeIndex = React.useMemo(() => {
    if (selectedTab) {
      return tabs.indexOf(selectedTab);
    }

    return -1;
  }, [selectedTab, tabs]);

  const previousActiveIndex = usePrevious(activeIndex);

  React.useEffect(() => {
    if (tabs.length === 0) {
      setSelectedTab(null);

      return;
    }

    if (selectedTab === null || (selectedTab && tabs.includes(selectedTab))) {
      return;
    }

    if (
      typeof previousActiveIndex === 'number' &&
      previousActiveIndex >= 0 &&
      (tabs[previousActiveIndex] || tabs[previousActiveIndex - 1])
    ) {
      setSelectedTab(tabs[previousActiveIndex] || tabs[previousActiveIndex - 1]);

      return;
    }

    if (defaultTab === null) {
      return;
    }

    setSelectedTab(defaultTab && tabs.includes(defaultTab) ? defaultTab : tabs[0]);
  }, [defaultTab, previousActiveIndex, selectedTab, setSelectedTab, tabs]);

  return state;
}
