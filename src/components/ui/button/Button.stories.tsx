import { Button } from "./Button";

import type { Meta, StoryObj } from "@storybook/react";

// Meta configuration for the Button component
const meta: Meta<typeof Button> = {
  title: "Components/UI/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A customizable button component with multiple variants and sizes.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "outline", "ghost"],
      description: "The visual style variant of the button",
      table: {
        type: { summary: "'default' | 'outline' | 'ghost'" },
        defaultValue: { summary: "'default'" },
      },
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      description: "The size of the button",
      table: {
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: "'md'" },
      },
    },
    children: {
      control: "text",
      description: "The content of the button",
      table: {
        type: { summary: "ReactNode" },
        defaultValue: { summary: "Button" },
      },
    },
    disabled: {
      control: "boolean",
      description: "Disable the button",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },

    onClick: {
      action: "clicked",
      description: "Click handler",
      table: {
        type: { summary: "() => void" },
      },
    },
  },
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Default button
/**
 * The default button style.
 */
export const Default: Story = {};

// Outline variant
/**
 * Button with outline style.
 */
export const Outline: Story = {
  args: {
    variant: "outline",
  },
};

// Ghost variant
/**
 * Button with ghost style (minimal styling).
 */
export const Ghost: Story = {
  args: {
    variant: "ghost",
  },
};

// Sizes
export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    size: "md",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
  },
};

// States
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};


// With custom content
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <svg
          className="mr-2 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Add Item
      </>
    ),
  },
};

