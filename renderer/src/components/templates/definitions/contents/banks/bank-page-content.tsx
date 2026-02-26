import { Separator, TitleList } from '@/components'
import { BankList } from './banks-list'

export function BankPageContent() {
    return (
        <div className="!py-4 sm:p-6 space-y-6">
            <TitleList
                title="Bancos"
                suTitle="Crie bancos que ajudarão no controlo das suas finanças"
            />
            {/* <Separator /> */}

            <BankList />
        </div>
    )
}
