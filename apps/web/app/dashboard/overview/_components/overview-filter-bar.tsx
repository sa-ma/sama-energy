import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
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

const railStyles = {
  borderRadius: 3,
  border: '1px solid rgba(203, 213, 225, 0.98)',
  backgroundColor: '#f6f8fb',
  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.75)',
} as const;

const fieldStyles = {
  minHeight: 42,
  backgroundColor: '#ffffff',
  borderRadius: 2.5,
  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05)',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(203, 213, 225, 0.98)',
  },
} as const;

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
    <Card
      sx={{
        ...railStyles,
        boxShadow: 'none',
      }}
    >
      <CardContent sx={{ p: { xs: 1.25, sm: 1.5 }, '&:last-child': { pb: { xs: 1.25, sm: 1.5 } } }}>
        <Stack spacing={1.1}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            spacing={1.25}
          >
            <Stack
              alignItems={{ xs: 'stretch', md: 'center' }}
              direction={{ xs: 'column', md: 'row' }}
              flexWrap="wrap"
              spacing={1.25}
              useFlexGap
            >
              <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 180 } }}>
                <Select
                  displayEmpty
                  value={market}
                  onChange={(event) => onMarketChange(event.target.value as MarketCode)}
                  sx={fieldStyles}
                >
                  {marketOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

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
                  minHeight: 44,
                  p: 0.25,
                  gap: 0.4,
                  borderRadius: 2.5,
                  border: '1px solid rgba(226, 232, 240, 0.95)',
                  borderColor: 'rgba(203, 213, 225, 0.98)',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05)',
                  '& .MuiToggleButtonGroup-grouped': {
                    border: 0,
                    borderRadius: '10px !important',
                    px: 1.6,
                    py: 0.65,
                    color: '#374151',
                    fontWeight: 600,
                    textTransform: 'none',
                    minHeight: 36,
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
