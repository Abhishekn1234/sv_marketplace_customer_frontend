import * as React from "react";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

/* ---------------- TYPES ---------------- */

type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "ref"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
  };

/* ---------------- MAIN COMPONENT ---------------- */

const PhoneInput = React.forwardRef<
  React.ElementRef<typeof RPNInput.default>,
  PhoneInputProps
>(({ className, onChange, value, ...props }, ref) => {
  return (
    <RPNInput.default
      ref={ref}
      className={cn("flex", className)}
      flagComponent={FlagComponent}
      countrySelectComponent={CountrySelect}
      inputComponent={InputComponent}
      smartCaret={false}
      value={value || undefined}
      onChange={(val) => onChange?.((val || "") as RPNInput.Value)}
      {...props}
    />
  );
});

PhoneInput.displayName = "PhoneInput";

/* ---------------- INPUT ---------------- */

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-10 w-full rounded-r-lg border border-input bg-background px-3 py-2 text-sm",
      className
    )}
    {...props}
  />
));

InputComponent.displayName = "InputComponent";

/* ---------------- COUNTRY SELECT ---------------- */

type CountryEntry = {
  label: string;
  value: RPNInput.Country | undefined;
};

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  options: CountryEntry[];
  onChange: (country: RPNInput.Country) => void;
};

const CountrySelect = ({
  disabled,
  value: selectedCountry,
  options: countryList,
  onChange,
}: CountrySelectProps) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className="flex gap-1 rounded-r-none border-r-0 px-3"
        >
          <FlagComponent
            country={selectedCountry}
            countryName={selectedCountry}
          />
          <ChevronsUpDown className="ml-1 size-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder="Search country..."
          />

          <CommandList>
            <ScrollArea className="h-72">
              <CommandEmpty>No country found.</CommandEmpty>

              <CommandGroup>
                {countryList.map(({ value, label }) =>
                  value ? (
                    <CountrySelectOption
                      key={value}
                      country={value}
                      countryName={label}
                      selectedCountry={selectedCountry}
                      onChange={onChange}
                      onClose={() => {
                        // IMPORTANT: prevents cmdk focus crash
                        requestAnimationFrame(() => {
                          setOpen(false);
                        });
                      }}
                    />
                  ) : null
                )}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

/* ---------------- OPTION (FIXED CRASH HERE) ---------------- */

interface CountrySelectOptionProps extends RPNInput.FlagProps {
  selectedCountry: RPNInput.Country;
  onChange: (country: RPNInput.Country) => void;
  onClose: () => void;
}

const CountrySelectOption = ({
  country,
  countryName,
  selectedCountry,
  onChange,
  onClose,
}: CountrySelectOptionProps) => {
  return (
    <CommandItem
      className="gap-2"
      onSelect={() => {
        onChange(country);

        // FIX: delay prevents react-phone-number-input focus crash
        requestAnimationFrame(() => {
          onClose();
        });
      }}
    >
      <FlagComponent country={country} countryName={countryName} />

      <span className="flex-1 text-sm">{countryName}</span>

      <span className="text-sm text-muted-foreground">
        +{RPNInput.getCountryCallingCode(country)}
      </span>

      <CheckIcon
        className={cn(
          "ml-auto size-4",
          country === selectedCountry ? "opacity-100" : "opacity-0"
        )}
      />
    </CommandItem>
  );
};

/* ---------------- FLAG ---------------- */

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-muted">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};

/* ---------------- EXPORT ---------------- */

export { PhoneInput };