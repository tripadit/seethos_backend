import { useState } from 'react';

import {
  DeleteIcon,
  FilterIcon,
  LeftArrowIcon,
  PencilIcon,
  RightArrowIcon,
  ShareIcon,
} from '@/assets/icons';
import { Pagination, SearchInput } from '@/components/molecules';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const DashboardTable = () => {
  const [activePage, setActivePage] = useState<number>(1);
  const THeader: string[] = [
    'Chatbot ID',
    'Agent Name',
    'Assigned To',
    'Date Created',
    'Sessions',
    'CTA Clicks',
    'Status',
    'Actions',
  ];
  const data = [
    {
      id: 1,
      name: 'Chatbot 1',
      assignedTo: 'John Doe',
      dateCreated: '10/10/2021',
      sessions: 100,
      conversions: 10,
      status: 'Active',
    },
    {
      id: 2,
      name: 'Chatbot 2',
      assignedTo: 'John Doe',
      dateCreated: '10/10/2021',
      sessions: 100,
      conversions: 10,
      status: 'Active',
    },
    {
      id: 3,
      name: 'Chatbot 3',
      assignedTo: 'John Doe',
      dateCreated: '10/10/2021',
      sessions: 100,
      conversions: 10,
      status: 'Active',
    },
  ];

  const renderer = () => {
    return data.map((item, idx) => (
      <TableRow key={idx}>
        <TableCell>{item.id}</TableCell>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.assignedTo}</TableCell>
        <TableCell>{item.dateCreated}</TableCell>
        <TableCell>{item.sessions}</TableCell>
        <TableCell>{item.conversions}</TableCell>
        <TableCell>
          <Badge variant="success">{item.status}</Badge>
        </TableCell>
        <TableCell>
          <Button variant="ghost" className="text-gray-700">
            <PencilIcon />
          </Button>
          <Button variant="ghost" className="text-gray-700">
            <DeleteIcon />
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Card className="border-none shadow-table ">
      <div className="flex items-center gap-4 px-6 py-4">
        <p>List of Bots</p>
        <Badge variant="count">3 Values</Badge>
      </div>
      <Separator className="mb-4" />
      <div className=" flex items-center justify-between px-6 py-4">
        <SearchInput onSearch={() => {}} className="w-96" />
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 text-gray-700">
            <FilterIcon />
            <p>Filters</p>
          </Button>
          <Button variant="outline">
            <ShareIcon />
          </Button>
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow className="border">
              {THeader.map((header, idx) => (
                <TableHead
                  className="w-[100px] text-left bg-gray-50 border-r border-gray-200"
                  key={idx}
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>{renderer()}</TableBody>
        </Table>
      </div>
      <div className="border-t px-6 pt-4 pb-5">
        <TableFooter className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Select>
              <SelectTrigger className="w-[60px]">
                <SelectValue placeholder={activePage.toString()} />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }).map((_, idx) => (
                  <SelectItem key={idx} value={idx.toString()}>
                    {idx + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-gray-700 text-sm">{`${activePage} - 10`} of 10 results</p>
          </div>
          <div>
            <Pagination
              itemsPerPage={5}
              totalItems={50}
              currentPage={activePage}
              onPageChange={(page) => setActivePage(page)}
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="text-gray-700 gap-3">
              <LeftArrowIcon /> <p className="text-gray-700">Previous</p>
            </Button>
            <Button variant="outline" className="text-gray-700 gap-3">
              <p className="text-gray-700">Next</p>
              <RightArrowIcon />
            </Button>
          </div>
        </TableFooter>
      </div>
    </Card>
  );
};
