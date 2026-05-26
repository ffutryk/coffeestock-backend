import { Column, CreateDateColumn, DeleteDateColumn, Entity, UpdateDateColumn } from "typeorm";

@Entity()
export abstract class Auditable {
  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @Column({ type: "int", name: "created_by", nullable: true })
  createdBy?: number | null;

  @UpdateDateColumn({ name: "updated_at", nullable: true })
  updatedAt?: Date | null;

  @Column({ type: "int", name: "updated_by", nullable: true })
  updatedBy?: number | null;

  @DeleteDateColumn({ name: "deleted_at", nullable: true })
  deletedAt?: Date | null;

  @Column({ type: "int", name: "deleted_by", nullable: true })
  deletedBy?: number | null;
}
