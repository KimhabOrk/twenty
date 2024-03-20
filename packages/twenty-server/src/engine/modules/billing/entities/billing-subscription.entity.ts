import { Field, ID, ObjectType } from '@nestjs/graphql';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Stripe from 'stripe';
import { IDField } from '@ptc-org/nestjs-query-graphql';

import { Workspace } from 'src/engine/modules/workspace/workspace.entity';
import { BillingSubscriptionItem } from 'src/engine/modules/billing/entities/billing-subscription-item.entity';

@Entity({ name: 'billingSubscription', schema: 'core' })
@ObjectType('BillingSubscription')
export class BillingSubscription {
  @IDField(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  deletedAt?: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @ManyToOne(() => Workspace, (workspace) => workspace.billingSubscriptions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  workspace: Workspace;

  @Column({ nullable: false, type: 'uuid' })
  workspaceId: string;

  @Column({ nullable: false })
  stripeCustomerId: string;

  @Column({ unique: true, nullable: false })
  stripeSubscriptionId: string;

  @Field()
  @Column({ nullable: false })
  status: Stripe.Subscription.Status;

  @Field({ nullable: true })
  @Column({ nullable: true })
  interval: Stripe.Price.Recurring.Interval;

  @OneToMany(
    () => BillingSubscriptionItem,
    (billingSubscriptionItem) => billingSubscriptionItem.billingSubscription,
  )
  billingSubscriptionItems: BillingSubscriptionItem[];
}
