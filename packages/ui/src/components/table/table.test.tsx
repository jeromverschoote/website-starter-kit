import { render, screen } from '@testing-library/react';

import { describe, expect, it } from 'vitest';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

const BasicTable = () => (
  <Table>
    <TableCaption>A list of items</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Status</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Item A</TableCell>
        <TableCell>Active</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Item B</TableCell>
        <TableCell>Inactive</TableCell>
      </TableRow>
    </TableBody>
    <TableFooter>
      <TableRow>
        <TableCell>Total</TableCell>
        <TableCell>2</TableCell>
      </TableRow>
    </TableFooter>
  </Table>
);

describe('Table', () => {
  it('renders a table element', () => {
    render(<BasicTable />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders the caption', () => {
    render(<BasicTable />);
    expect(screen.getByText('A list of items')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(<BasicTable />);
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Status' })).toBeInTheDocument();
  });

  it('renders data rows', () => {
    render(<BasicTable />);
    expect(screen.getByText('Item A')).toBeInTheDocument();
    expect(screen.getByText('Item B')).toBeInTheDocument();
  });

  it('renders the footer', () => {
    render(<BasicTable />);
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('applies a custom className to Table', () => {
    render(
      <Table className="custom-table">
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole('table')).toHaveClass('custom-table');
  });
});
