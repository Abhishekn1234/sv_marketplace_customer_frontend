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

type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "ref"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
  };

const PhoneInput = React.forwardRef<
  React.ElementRef<typeof RPNInput.default>,
  PhoneInputProps
>(({ className, onChange, value, ...props }, ref) => {
  return (
    <RPNInput.default
      ref={ref}
      className={cn("flex w-full items-stretch", className)}
      flagComponent={FlagComponent}
      countrySelectComponent={CountrySelect}
      inputComponent={InputComponent}
      smartCaret={false}
      value={value || undefined}
      onChange={(value) => onChange?.((value || "") as RPNInput.Value)}
      {...props}
    />
  );
});

PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-l-none rounded-r-xl border border-l-0 border-input bg-background px-3 text-sm shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});

InputComponent.displayName = "InputComponent";

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
          className={cn(
            "h-11 rounded-r-none rounded-l-xl border-r-0 px-3",
            "flex items-center gap-2 shrink-0"
          )}
        >
          <FlagComponent
            country={selectedCountry}
            countryName={selectedCountry}
          />
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[320px] p-0">
        <Command>
          <CommandInput
            placeholder="Search country..."
            value={search}
            onValueChange={setSearch}
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
                      onClose={() =>
                        requestAnimationFrame(() => setOpen(false))
                      }
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
      className="gap-3"
      onSelect={() => {
        onChange(country);

        requestAnimationFrame(() => {
          onClose();
        });
      }}
    >
      <FlagComponent country={country} countryName={countryName} />

      <span className="flex-1">{countryName}</span>

      <span className="text-muted-foreground">
        +{RPNInput.getCountryCallingCode(country)}
      </span>

      <CheckIcon
        className={cn(
          "ml-auto h-4 w-4",
          selectedCountry === country ? "opacity-100" : "opacity-0"
        )}
      />
    </CommandItem>
  );
};

const FlagComponent = ({
  country,
  countryName,
}: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex h-5 w-7 items-center justify-center overflow-hidden rounded-sm">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};

export { PhoneInput };