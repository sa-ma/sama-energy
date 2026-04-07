import { useState, type KeyboardEvent, type MouseEvent } from 'react';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  FilterMultiSelectTrigger,
  FilterRail,
  FilterSegmentedControl,
  FilterSelectField,
} from '@sama-energy/ui';
import type {
  DateRange,
  DurationHours,
  MarketCode,
} from '@sama-energy/contracts';

type SelectOption<T extends string | number> = {
  value: T;
  label: string;
};

const visuallyHidden = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: 1,
  margin: -1,
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: 1,
} as const;

type ComparisonFilterBarProps = {
  markets: MarketCode[];
  durationHours: DurationHours;
  dateRange: DateRange;
  marketOptions: ReadonlyArray<SelectOption<MarketCode>>;
  durationOptions: ReadonlyArray<SelectOption<DurationHours>>;
  dateRangeOptions: ReadonlyArray<SelectOption<DateRange>>;
  isUpdating?: boolean;
  helperMessage?: string;
  onMarketsChange: (value: MarketCode[]) => void;
  onDurationChange: (value: DurationHours) => void;
  onDateRangeChange: (value: DateRange) => void;
};

export default function ComparisonFilterBar({
  markets,
  durationHours,
  dateRange,
  marketOptions,
  durationOptions,
  dateRangeOptions,
  isUpdating = false,
  helperMessage,
  onMarketsChange,
  onDurationChange,
  onDateRangeChange,
}: ComparisonFilterBarProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const selectedMarkets = markets.map((marketCode) => ({
    code: marketCode,
    label:
      marketOptions.find((option) => option.value === marketCode)?.label ?? marketCode,
  }));

  const handleToggleMarket = (marketCode: MarketCode) => {
    const isSelected = markets.includes(marketCode);

    if (isSelected) {
      if (markets.length <= 2) {
        return;
      }

      onMarketsChange(markets.filter((value) => value !== marketCode));
      return;
    }

    if (markets.length >= 3) {
      return;
    }

    onMarketsChange([...markets, marketCode]);
  };

  const handleRemoveMarket = (
    event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>,
    marketCode: MarketCode,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (markets.length <= 2) {
      return;
    }

    onMarketsChange(markets.filter((value) => value !== marketCode));
  };

  return (
    <FilterRail variant="flat">
      <Stack spacing={1.1}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          spacing={1}
        >
          <Box>
            <FilterMultiSelectTrigger
              ariaLabel="Markets"
              endIcon={<KeyboardArrowDownRoundedIcon />}
              expanded={Boolean(anchorEl)}
              onClick={(event) => setAnchorEl(event.currentTarget)}
              sx={{ minWidth: { xs: '100%', md: 250 } }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 0.65,
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  minWidth: 0,
                }}
              >
                {selectedMarkets.map((market) => (
                  <Box
                    key={market.code}
                    component="span"
                    sx={(theme) => ({
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.35,
                      minHeight: 24,
                      borderRadius: `${theme.sama.radius.sm / 2}px`,
                      border: `1px solid ${theme.sama.border.strong}`,
                      backgroundColor: theme.sama.surface.raised,
                      px: 0.7,
                      py: 0.22,
                      color: theme.sama.text.primary,
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                    })}
                  >
                    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                      {market.label}
                    </Box>
                    {markets.length > 2 ? (
                      <Box
                        component="span"
                        role="button"
                        tabIndex={0}
                        aria-label={`Remove ${market.label}`}
                        onClick={(event) => handleRemoveMarket(event, market.code)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            handleRemoveMarket(event, market.code);
                          }
                        }}
                        sx={(theme) => ({
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 16,
                          height: 16,
                          borderRadius: `${theme.sama.radius.sm / 2}px`,
                          color: theme.sama.text.muted,
                          transition: 'background-color 160ms ease, color 160ms ease',
                          '&:hover': {
                            backgroundColor: theme.sama.surface.subtle,
                            color: theme.sama.text.primary,
                          },
                        })}
                      >
                        <CloseRoundedIcon sx={{ fontSize: '0.9rem' }} />
                      </Box>
                    ) : null}
                  </Box>
                ))}
              </Box>
            </FilterMultiSelectTrigger>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              {marketOptions.map((option) => {
                const isSelected = markets.includes(option.value);
                const isDisabled =
                  (!isSelected && markets.length >= 3) ||
                  (isSelected && markets.length <= 2);

                return (
                  <MenuItem
                    key={option.value}
                    disabled={isDisabled}
                    onClick={() => handleToggleMarket(option.value)}
                    sx={{
                      minHeight: 42,
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 1,
                    }}
                  >
                    <Typography sx={{ fontSize: '0.94rem', fontWeight: 600 }}>
                      {option.label}
                    </Typography>
                    <Checkbox
                      checked={isSelected}
                      disableRipple
                      sx={{ p: 0 }}
                    />
                  </MenuItem>
                );
              })}
            </Menu>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: { xs: 'stretch', md: 'center' },
              flexDirection: { xs: 'column', md: 'row' },
              flexWrap: 'wrap',
              gap: 1,
              ml: { md: 'auto' },
            }}
          >
            <Box
              sx={(theme) => ({
                width: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.sama.text.secondary,
                pr: 0.5,
                flexShrink: 0,
              })}
              aria-atomic={isUpdating ? 'true' : undefined}
              aria-live={isUpdating ? 'polite' : undefined}
              role={isUpdating ? 'status' : undefined}
            >
              <CircularProgress
                aria-hidden="true"
                size={14}
                thickness={5}
                sx={{ visibility: isUpdating ? 'visible' : 'hidden' }}
              />
              {isUpdating ? (
                <Box component="span" sx={visuallyHidden}>
                  Updating…
                </Box>
              ) : null}
            </Box>

            <FilterSegmentedControl
              ariaLabel="Duration"
              value={durationHours}
              onChange={(value) => onDurationChange(value as DurationHours)}
              options={durationOptions.map((option) => ({
                value: option.value,
                label: `${option.value}h`,
              }))}
            />

            <FilterSelectField
              ariaLabel="Date Range"
              value={dateRange}
              onChange={(value) => onDateRangeChange(value as DateRange)}
              startAdornment={<CalendarTodayRoundedIcon sx={{ fontSize: '1rem' }} />}
              sx={{ minWidth: { xs: '100%', md: 170 } }}
            >
              {dateRangeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </FilterSelectField>
          </Box>
        </Stack>
        {helperMessage ? (
          <Alert severity="warning" variant="outlined">
            {helperMessage}
          </Alert>
        ) : null}
      </Stack>
    </FilterRail>
  );
}
