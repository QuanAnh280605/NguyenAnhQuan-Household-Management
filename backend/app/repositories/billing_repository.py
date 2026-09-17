from typing import Any, Dict, List, Optional
from backend.app.db.session import get_db_pool

class BillingRepository:
    async def find_invoice_by_id(self, invoice_id: str) -> Optional[Dict[str, Any]]:
        pool = await get_db_pool()
        if not pool:
            return None

        query = """
            SELECT i.*, a.room_number, b.code as building_code
            FROM invoices i
            JOIN apartments a ON i.apartment_id = a.id
            JOIN buildings b ON a.building_id = b.id
            WHERE i.id = $1
        """
        async with pool.acquire() as conn:
            row = await conn.fetchrow(query, invoice_id)
            if not row:
                return None
            invoice = dict(row)
            items_query = "SELECT * FROM invoice_items WHERE invoice_id = $1"
            item_rows = await conn.fetch(items_query, invoice_id)
            invoice["items"] = [dict(item) for item in item_rows]
            return invoice

    async def find_invoice_by_code(self, invoice_code: str) -> Optional[Dict[str, Any]]:
        pool = await get_db_pool()
        if not pool:
            return None

        query = """
            SELECT i.*, a.room_number, b.code as building_code
            FROM invoices i
            JOIN apartments a ON i.apartment_id = a.id
            JOIN buildings b ON a.building_id = b.id
            WHERE i.invoice_code = $1
        """
        async with pool.acquire() as conn:
            row = await conn.fetchrow(query, invoice_code)
            return dict(row) if row else None

    async def find_all_invoices(
        self,
        month: Optional[str] = None,
        status: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        pool = await get_db_pool()
        if not pool:
            return []

        query = """
            SELECT i.*, a.room_number, b.code as building_code
            FROM invoices i
            JOIN apartments a ON i.apartment_id = a.id
            JOIN buildings b ON a.building_id = b.id
            WHERE 1=1
        """
        params = []
        idx = 1

        if month and month != "ALL":
            query += f" AND i.billing_month = ${idx}"
            params.append(month)
            idx += 1
        if status and status != "ALL":
            query += f" AND i.status = ${idx}"
            params.append(status)
            idx += 1

        query += " ORDER BY i.created_at DESC"
        async with pool.acquire() as conn:
            rows = await conn.fetch(query, *params)
            return [dict(row) for row in rows]

    async def find_transaction_by_code(self, transaction_code: str) -> Optional[Dict[str, Any]]:
        pool = await get_db_pool()
        if not pool:
            return None

        query = "SELECT * FROM payment_transactions WHERE transaction_code = $1"
        async with pool.acquire() as conn:
            row = await conn.fetchrow(query, transaction_code)
            return dict(row) if row else None

    async def record_payment_transaction(self, data: Dict[str, Any]) -> Dict[str, Any]:
        pool = await get_db_pool()
        query = """
            INSERT INTO payment_transactions (invoice_id, amount, payment_method, transaction_code, note, paid_at)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        """
        async with pool.acquire() as conn:
            row = await conn.fetchrow(
                query,
                data["invoice_id"],
                data["amount"],
                data["payment_method"],
                data["transaction_code"],
                data.get("note"),
                data.get("paid_at"),
            )
            return dict(row)

    async def update_invoice_paid_amount(self, invoice_id: str, additional_amount: float) -> Dict[str, Any]:
        pool = await get_db_pool()
        query = """
            UPDATE invoices
            SET paid_amount = paid_amount + $2,
                status = CASE
                    WHEN (paid_amount + $2) >= total_amount THEN 'PAID'::invoice_status
                    ELSE 'PARTIAL'::invoice_status
                END,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        """
        async with pool.acquire() as conn:
            row = await conn.fetchrow(query, invoice_id, additional_amount)
            return dict(row)
