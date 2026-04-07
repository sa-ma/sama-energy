import { useState } from 'react';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
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

const railStyles = {
  borderRadius: 3,
  border: '1px solid rgba(203, 213, 225, 0.86)',
  backgroundColor: 'rgba(246, 248, 251, 0.98)',
  boxShadow:
    '0 6px 16px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.86)',
} as const;

const fieldStyles = {
  minHeight: 40,
  backgroundColor: '#ffffff',
  borderRadius: 2.25,
  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
  '& .MuiSelect-select': {
    display: 'flex',
    alignItems: 'center',
    minHeight: '40px !important',
    boxSizing: 'border-box',
    py: '0 !important',
    fontSize: '0.86rem',
    fontWeight: 600,
    color: '#0f172a',
  },
  '& .MuiSelect-icon': {
    color: '#64748b',
    fontSize: '1.1rem',
    right: 10,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(203, 213, 225, 0.9)',
  },
} as const;

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
    <Card
      sx={{
        ...railStyles,
      }}
    >
      <CardContent sx={{ p: { xs: 1, sm: 1.1 }, '&:last-child': { pb: { xs: 1, sm: 1.1 } } }}>
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
                <Button
                  color="inherit"
                  endIcon={<KeyboardArrowDownRoundedIcon />}
                  onClick={(event) => setAnchorEl(event.currentTarget)}
                  sx={{
                    ...fieldStyles,
                    minWidth: { xs: '100%', md: 250 },
                    minHeight: 40,
                    justifyContent: 'space-between',
                    px: 1,
                    py: 0.5,
                    color: '#0f172a',
                    border: '1px solid rgba(203, 213, 225, 0.9)',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    lineHeight: 1.2,
                    textTransform: 'none',
                    '& .MuiButton-endIcon': {
                      ml: 0.75,
                      color: '#64748b',
                      '& svg': {
                        fontSize: '1.1rem',
                      },
                    },
                  }}
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
                        sx={{
                          borderRadius: 1.5,
                          border: '1px solid rgba(203, 213, 225, 0.95)',
                          backgroundColor: 'rgba(255, 255, 255, 0.96)',
                          px: 0.7,
                          py: 0.22,
                          color: '#0f172a',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          lineHeight: 1.2,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {label}
                      </Box>
                    ))}
                  </Box>
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 260,
                      borderRadius: 2.5,
                      border: '1px solid rgba(203, 213, 225, 0.98)',
                      boxShadow: '0 14px 30px rgba(15, 23, 42, 0.12)',
                    },
                  }}
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

              <ToggleButtonGroup
                exclusive
                size="small"
                value={durationHours}
                onChange={(_, value) => {
                  if (value !== null) {
                    onDurationChange(value as DurationHours);
                  }
                }}
                sx={{
                  minHeight: 40,
                  p: 0.25,
                  gap: 0.25,
                  borderRadius: 2.25,
                  border: '1px solid rgba(203, 213, 225, 0.9)',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
                  '& .MuiToggleButtonGroup-grouped': {
                    border: 0,
                    borderRadius: '8px !important',
                    px: 1.35,
                    py: 0.55,
                    color: '#374151',
                    fontWeight: 600,
                    fontSize: '0.86rem',
                    textTransform: 'none',
                    minHeight: 34,
                    lineHeight: 1.2,
                  },
                  '& .MuiToggleButton-root.Mui-selected': {
                    backgroundColor: '#eef2f7',
                    color: '#0f172a',
                  },
                  '& .MuiToggleButton-root:hover': {
                    backgroundColor: '#f8fafc',
                  },
                  '& .MuiToggleButton-root.Mui-selected:hover': {
                    backgroundColor: '#f3f4f6',
                  },
                }}
              >
                {durationOptions.map((option) => (
                  <ToggleButton key={option.value} value={option.value}>
                    {option.value}h
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
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
                  sx={{ color: '#4b5563', pr: 0.5 }}
                >
                  <CircularProgress size={14} thickness={5} />
                  <Typography variant="body2">Updating</Typography>
                </Stack>
              ) : null}

              <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 170 } }}>
                <Select
                  displayEmpty
                  value={dateRange}
                  onChange={(event) => onDateRangeChange(event.target.value as DateRange)}
                  sx={fieldStyles}
                >
                  {dateRangeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Stack>
          {helperMessage ? (
            <Alert severity="warning" variant="outlined">
              {helperMessage}
            </Alert>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
