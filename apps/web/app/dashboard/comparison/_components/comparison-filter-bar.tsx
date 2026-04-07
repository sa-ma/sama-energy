import { useState } from 'react';
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
  const selectedMarketLabels = markets.map(
    (marketCode) =>
      marketOptions.find((option) => option.value === marketCode)?.label ?? marketCode,
  );

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

  return (
    <FilterRail>
      <Stack spacing={1.1}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          spacing={1}
        >
          <Stack
            alignItems={{ xs: 'stretch', md: 'center' }}
            direction={{ xs: 'column', md: 'row' }}
            flexWrap="wrap"
            spacing={1}
            useFlexGap
          >
            <Box>
              <FilterMultiSelectTrigger
                endIcon={<KeyboardArrowDownRoundedIcon />}
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
                  {selectedMarketLabels.map((label) => (
                    <Box
                      key={label}
                      component="span"
                      sx={(theme) => ({
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
                      {label}
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

            <FilterSegmentedControl
              value={durationHours}
              onChange={(value) => onDurationChange(value as DurationHours)}
              options={durationOptions.map((option) => ({
                value: option.value,
                label: `${option.value}h`,
              }))}
            />
          </Stack>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
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

            <FilterSelectField
              value={dateRange}
              onChange={(value) => onDateRangeChange(value as DateRange)}
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
