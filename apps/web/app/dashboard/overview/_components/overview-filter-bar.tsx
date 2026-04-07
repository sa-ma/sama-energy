import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
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

type OverviewFilterBarProps = {
  market: string;
  durationHours: number;
  dateRange: string;
  marketOptions: ReadonlyArray<SelectOption<string>>;
  durationOptions: ReadonlyArray<SelectOption<number>>;
  dateRangeOptions: ReadonlyArray<SelectOption<string>>;
  isUpdating?: boolean;
  helperMessage?: string;
  onMarketChange: (value: MarketCode) => void;
  onDurationChange: (value: DurationHours) => void;
  onDateRangeChange: (value: DateRange) => void;
};

export default function OverviewFilterBar({
  market,
  durationHours,
  dateRange,
  marketOptions,
  durationOptions,
  dateRangeOptions,
  isUpdating = false,
  helperMessage,
  onMarketChange,
  onDurationChange,
  onDateRangeChange,
}: OverviewFilterBarProps) {
  return (
    <FilterRail variant="flat">
      <Stack spacing={1.1}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          spacing={1.25}
        >
          <Box>
            <FilterSelectField
              value={market}
              onChange={(value) => onMarketChange(value as MarketCode)}
              sx={{ minWidth: { xs: '100%', md: 180 } }}
            >
              {marketOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </FilterSelectField>
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
            {isUpdating ? (
              <Stack
                alignItems="center"
                direction="row"
                spacing={0.75}
                sx={(theme) => ({ color: theme.sama.text.secondary, pr: 0.5 })}
              >
                <CircularProgress size={14} thickness={5} />
                <Typography variant="body2">Updating</Typography>
              </Stack>
            ) : null}

            <FilterSegmentedControl
              value={durationHours}
              onChange={(value) => onDurationChange(value as DurationHours)}
              options={durationOptions.map((option) => ({
                value: option.value,
                label: `${option.value}h`,
              }))}
            />

            <FilterSelectField
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
