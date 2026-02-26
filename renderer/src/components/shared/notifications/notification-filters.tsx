"use client";
import {
  Button,
  Input,
  Icon,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem
} from "@/components";

interface NotificationFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterStatus: "all" | "read" | "unread";
  setFilterStatus: (value: "all" | "read" | "unread") => void;
  filterType: "all" | "INFO" | "WARNING" | "ERROR";
  setFilterType: (value: "all" | "INFO" | "WARNING" | "ERROR") => void;
  compact?: boolean;
}

export function NotificationFilters({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterType,
  setFilterType,
  compact = false
}: NotificationFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div className="relative w-full sm:max-w-md">
        <Icon
          name="Search"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
        />
        <Input
          placeholder="Buscar notificações..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-background"
        />
      </div>

      <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border gap-2 shrink-0">
              <Icon name="ListFilter" className="h-4 w-4" />
              Filtrar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              checked={filterStatus === 'all'}
              onCheckedChange={() => setFilterStatus('all')}
            >
              Todas
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filterStatus === 'unread'}
              onCheckedChange={() => setFilterStatus('unread')}
            >
              Não lidas
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filterStatus === 'read'}
              onCheckedChange={() => setFilterStatus('read')}
            >
              Lidas
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border gap-2 shrink-0">
              <Icon name="Tag" className="h-4 w-4" />
              Tipo
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              checked={filterType === 'all'}
              onCheckedChange={() => setFilterType('all')}
            >
              Todos
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filterType === 'INFO'}
              onCheckedChange={() => setFilterType('INFO')}
            >
              Info
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filterType === 'WARNING'}
              onCheckedChange={() => setFilterType('WARNING')}
            >
              Avisos
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filterType === 'ERROR'}
              onCheckedChange={() => setFilterType('ERROR')}
            >
              Erros
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </div>
  );
}
