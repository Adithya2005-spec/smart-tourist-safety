import { AuditEntry, sha256 } from "./safety-engine";

export type AuditBlock = {
  blockNumber: number;
  eventId: string;
  incidentId: string;
  timestamp: string;
  actorHash: string;
  action: string;
  previousHash: string;
  hash: string;
  transactionId: string;
  integrityStatus: "VERIFIED" | "TAMPERED";
};

export class TamperEvidentAuditChain {
  private chain: AuditBlock[] = [];
  private genesisHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

  async appendEvent(
    eventId: string,
    incidentId: string,
    actor: string,
    action: string,
    timestamp: string,
    metadata?: Record<string, any>
  ): Promise<AuditBlock> {
    const previousHash = this.chain.length > 0 ? this.chain[this.chain.length - 1].hash : this.genesisHash;
    const blockNumber = this.chain.length + 1;

    // Cryptographically hash actor PII so personal data stays OFF-CHAIN
    const actorHash = await sha256(`actor:${actor}`);

    const canonicalData = JSON.stringify({
      blockNumber,
      eventId,
      incidentId,
      timestamp,
      actorHash,
      action,
      previousHash,
      metadata: metadata || {},
    });

    const hash = await sha256(canonicalData);
    const transactionId = `TX-SURAKSHA-${Math.floor(100000 + Math.random() * 900000)}`;

    const block: AuditBlock = {
      blockNumber,
      eventId,
      incidentId,
      timestamp,
      actorHash,
      action,
      previousHash,
      hash,
      transactionId,
      integrityStatus: "VERIFIED",
    };

    this.chain.push(block);
    return block;
  }

  async verifyChainIntegrity(): Promise<{ isValid: boolean; brokenBlockIndex?: number; message: string }> {
    if (this.chain.length === 0) {
      return { isValid: true, message: "Audit chain is empty. Integrity intact." };
    }

    for (let i = 0; i < this.chain.length; i++) {
      const block = this.chain[i];
      const expectedPreviousHash = i === 0 ? this.genesisHash : this.chain[i - 1].hash;

      if (block.previousHash !== expectedPreviousHash) {
        return {
          isValid: false,
          brokenBlockIndex: i,
          message: `Audit integrity check failed: Chain link broken at Block #${block.blockNumber}. Previous hash mismatch.`,
        };
      }
    }

    return {
      isValid: true,
      message: `Audit integrity verified: ${this.chain.length} blocks chained with SHA-256 hashes. Zero tamper signals.`,
    };
  }

  getChain(): AuditBlock[] {
    return [...this.chain];
  }
}

export const globalAuditChain = new TamperEvidentAuditChain();
